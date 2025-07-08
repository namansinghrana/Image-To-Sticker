from fastapi import FastAPI, UploadFile, File, Query
from fastapi.responses import StreamingResponse
import cv2
import numpy as np
from PIL import Image
import io
import requests
from fastapi.middleware.cors import CORSMiddleware

REMOVE_BG_API_KEY = "cMBE3ZUjoV8tCVFRHw1ecJ8w"

app = FastAPI()

app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:5173"],  # Allows all origins. For production, specify your frontend URL(s) instead of "*"
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )


def remove_bg_with_removebg(image_bytes, api_key):
    response = requests.post(
        'https://api.remove.bg/v1.0/removebg',
        files={'image_file': image_bytes},
        data={'size': 'auto'},
        headers={'X-Api-Key': api_key},
    )
    if response.status_code == requests.codes.ok:
        return Image.open(io.BytesIO(response.content)).convert("RGBA")
    else:
        raise Exception(f"remove.bg API error: {response.status_code} {response.text}")

def add_sticker_border_smooth(pil_img, border_thickness=15, border_color=(255,255,255,255), blur_radius=8):
    img = np.array(pil_img)
    if img.shape[2] == 3:
        alpha = np.ones(img.shape[:2], dtype=np.uint8) * 255
        img = np.dstack([img, alpha])
    alpha = img[:, :, 3]
    
    # Create a softer dilation kernel (circular-like)
    kernel_size = max(3, border_thickness)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kernel_size, kernel_size))
    border_mask = cv2.dilate(alpha, kernel, iterations=1)
    
    # Apply multiple blur passes for ultra-smooth borders
    if blur_radius > 0:
        # First pass: strong blur
        border_mask = cv2.GaussianBlur(border_mask, (2*blur_radius+1, 2*blur_radius+1), blur_radius/2)
        # Second pass: additional smoothing
        border_mask = cv2.GaussianBlur(border_mask, (blur_radius+1, blur_radius+1), blur_radius/4)
    
    # Create RGBA border image
    border_img = np.zeros_like(img)
    for c in range(3):
        border_img[:, :, c] = border_color[c]
    border_img[:, :, 3] = border_mask
    
    # Composite: border first, then original subject
    border_pil = Image.fromarray(border_img, mode="RGBA")
    result = Image.alpha_composite(border_pil, pil_img)
    return result

def apply_contour_gloss(pil_img, intensity=0.3):
    img = np.array(pil_img)
    if img.shape[2] == 3:
        alpha = np.ones(img.shape[:2], dtype=np.uint8) * 255
    else:
        alpha = img[:, :, 3]
    ys, xs = np.where(alpha > 0)
    if len(ys) == 0:
        return pil_img
    min_y = np.min(ys)
    max_y = np.max(ys)
    gloss_y = min_y + int(0.2 * (max_y - min_y))
    gloss_mask = np.zeros_like(alpha, dtype=np.uint8)
    # Set gloss_mask to 255 for all (y, x) where y < gloss_y and alpha > 0
    rows = np.arange(alpha.shape[0])
    mask_rows = (rows[:, None] < gloss_y) & (alpha > 0)
    gloss_mask[mask_rows] = 255
    gloss_layer = np.zeros_like(img, dtype=np.uint8)
    for c in range(3):
        gloss_layer[:, :, c] = gloss_mask
    gloss_layer = cv2.GaussianBlur(gloss_layer, (51, 51), 0)
    img[:, :, :3] = cv2.addWeighted(img[:, :, :3], 1.0, gloss_layer[:, :, :3], intensity, 0)
    return Image.fromarray(img)

@app.post("/process")
async def process_image(
    image: UploadFile = File(...),
    border_thickness: int = Query(15, description="Thickness of the border"),
    border_r: int = Query(255, description="Border color R (0-255)"),
    border_g: int = Query(255, description="Border color G (0-255)"),
    border_b: int = Query(255, description="Border color B (0-255)"),
    border_a: int = Query(255, description="Border color alpha (0-255)"),
    gloss_intensity: float = Query(0.0, description="Intensity of the gloss effect (0-1, 0 disables)"),
    bg_r: int = Query(200, description="Background color R (0-255)"),
    bg_g: int = Query(200, description="Background color G (0-255)"),
    bg_b: int = Query(200, description="Background color B (0-255)")
):
    contents = await image.read()
    # Step 1: Remove background using remove.bg API
    try:
        no_bg = remove_bg_with_removebg(("image.png", contents), REMOVE_BG_API_KEY)
    except Exception as e:
        return {"error": str(e)}
    # Step 2: Add smooth, sticker-like border
    bordered = add_sticker_border_smooth(no_bg, border_thickness=border_thickness, border_color=(border_r, border_g, border_b, border_a), blur_radius=8)
    # Step 3: Composite onto a plain background color
    bg_color = (bg_r, bg_g, bg_b)
    bg_img = Image.new("RGB", bordered.size, bg_color)
    bg_img.paste(bordered, mask=bordered.split()[3])
    buf = io.BytesIO()
    bg_img.save(buf, format="PNG")
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png") 