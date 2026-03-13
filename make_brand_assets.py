from PIL import Image, ImageDraw, ImageFont
import os
root = r'C:\Users\agent\.openclaw\workspace\ZeroDayDiary'
public = os.path.join(root, 'public')
assets = os.path.join(root, 'src', 'assets')
os.makedirs(public, exist_ok=True)
os.makedirs(assets, exist_ok=True)

# favicon / icon
size = 256
img = Image.new('RGBA', (size, size), '#020617')
d = ImageDraw.Draw(img)
# glow bg
for inset, color in [(12, (6,182,212,32)), (24, (139,92,246,36))]:
    d.rounded_rectangle((inset, inset, size-inset, size-inset), radius=52, fill=color)
# lens
cx, cy, r = 104, 104, 52
for w in range(10):
    d.ellipse((cx-r-w, cy-r-w, cx+r+w, cy+r+w), outline=(226,232,240,220 if w==0 else 40), width=2)
# handle
d.rounded_rectangle((142, 142, 208, 160), radius=9, fill=(226,232,240,235))
# diagonal connector
d.polygon([(138,138),(150,126),(167,143),(155,155)], fill=(226,232,240,235))
# small cyan signal dot
d.ellipse((72,72,94,94), fill=(34,211,238,255))
# save favicon variants
img.save(os.path.join(public, 'favicon.png'))
img.resize((64,64), Image.LANCZOS).save(os.path.join(public, 'favicon.ico'))

# social card
W,H = 1200,630
card = Image.new('RGB', (W,H), '#050b16')
d = ImageDraw.Draw(card)
for y in range(H):
    # gradient background
    r = int(5 + 10*y/H)
    g = int(11 + 16*y/H)
    b = int(22 + 28*y/H)
    d.line((0,y,W,y), fill=(r,g,b))
# subtle glows
for bbox, fill in [((40,30,520,420),(6,182,212,40)), ((640,120,1180,520),(139,92,246,35))]:
    glow = Image.new('RGBA', (W,H), (0,0,0,0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse(bbox, fill=fill)
    card = Image.alpha_composite(card.convert('RGBA'), glow).convert('RGB')
    d = ImageDraw.Draw(card)
# grid
for x in range(0,W,48):
    d.line((x,0,x,H), fill=(255,255,255,12), width=1)
for y in range(0,H,48):
    d.line((0,y,W,y), fill=(255,255,255,12), width=1)

try:
    title_font = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 76)
    sub_font = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 30)
    small_font = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 22)
except:
    title_font = sub_font = small_font = ImageFont.load_default()

# icon block
ix, iy = 90, 92
icon = img.resize((128,128), Image.LANCZOS)
card.paste(icon, (ix,iy), icon)
d = ImageDraw.Draw(card)
d.text((240, 106), 'ZeroDayDiary', font=title_font, fill=(248,250,252))
d.text((242, 200), 'Tracking security, privacy, and AI risk signals around the world.', font=sub_font, fill=(191,219,254))
# labels
labels = ['Security incidents', 'Privacy erosion', 'AI governance risk']
startx = 242
for i, label in enumerate(labels):
    x = startx + i*250
    d.rounded_rectangle((x,272,x+210,314), radius=18, fill=(34,211,238,30), outline=(34,211,238,120), width=2)
    d.text((x+18,283), label, font=small_font, fill=(165,243,252))
# footer strip
panel = (72, 392, 1128, 558)
d.rounded_rectangle(panel, radius=28, fill=(12,18,34), outline=(148,163,184), width=1)
d.text((108, 432), 'Git-first publishing • reviewable changes • static architecture', font=sub_font, fill=(226,232,240))
d.text((108, 482), 'Briefings designed for operators, researchers, and policy watchers who need signal over noise.', font=small_font, fill=(148,163,184))
card.save(os.path.join(assets, 'social-card.png'))
print('done')
