"""
Módulo para combinar imagens antes/depois com logo e etiquetas
"""
from PIL import Image, ImageDraw, ImageFont
import io
import requests
from typing import Tuple

def download_image(url: str) -> Image.Image:
    """Download imagem de uma URL"""
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return Image.open(io.BytesIO(response.content))

def create_before_after_image(
    before_image_url: str,
    after_image_url: str,
    logo_url: str = None
) -> bytes:
    """
    Cria imagem combinada antes/depois com logo e etiquetas
    
    Args:
        before_image_url: URL da imagem original
        after_image_url: URL da imagem transformada
        logo_url: URL do logo (opcional)
    
    Returns:
        bytes: Imagem combinada em formato PNG
    """
    # Download das imagens
    before_img = download_image(before_image_url)
    after_img = download_image(after_image_url)
    
    # Redimensionar para mesma altura (mantendo aspect ratio)
    target_height = 800
    before_ratio = before_img.width / before_img.height
    after_ratio = after_img.width / after_img.height
    
    before_width = int(target_height * before_ratio)
    after_width = int(target_height * after_ratio)
    
    before_img = before_img.resize((before_width, target_height), Image.Resampling.LANCZOS)
    after_img = after_img.resize((after_width, target_height), Image.Resampling.LANCZOS)
    
    # Dimensões da imagem final
    divider_width = 8  # Largura do divisor laranja
    logo_height = 80  # Espaço para o logo no topo
    total_width = before_width + divider_width + after_width
    total_height = target_height + logo_height
    
    # Criar canvas branco
    combined = Image.new('RGB', (total_width, total_height), 'white')
    
    # Colar imagens
    combined.paste(before_img, (0, logo_height))
    combined.paste(after_img, (before_width + divider_width, logo_height))
    
    # Desenhar divisor laranja vertical
    draw = ImageDraw.Draw(combined)
    draw.rectangle(
        [(before_width, logo_height), (before_width + divider_width, total_height)],
        fill='#f97316'  # orange-500
    )
    
    # Adicionar logo no topo central (se fornecido)
    if logo_url:
        try:
            logo = download_image(logo_url)
            logo_size = 60
            logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
            logo_x = (total_width - logo_size) // 2
            logo_y = (logo_height - logo_size) // 2
            
            # Se o logo tiver transparência, usar paste com máscara
            if logo.mode == 'RGBA':
                combined.paste(logo, (logo_x, logo_y), logo)
            else:
                combined.paste(logo, (logo_x, logo_y))
        except Exception as e:
            print(f"Erro ao adicionar logo: {e}")
    
    # Adicionar etiquetas "Antes" e "Depois"
    try:
        # Tentar usar fonte do sistema
        font_size = 32
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
        except:
            font = ImageFont.load_default()
        
        # Etiqueta "Antes" (canto superior esquerdo)
        label_padding = 15
        label_y = logo_height + label_padding
        
        # Fundo semi-transparente para "Antes"
        antes_text = "Antes"
        antes_bbox = draw.textbbox((0, 0), antes_text, font=font)
        antes_width = antes_bbox[2] - antes_bbox[0]
        antes_height = antes_bbox[3] - antes_bbox[1]
        
        draw.rectangle(
            [(label_padding, label_y), (label_padding + antes_width + 20, label_y + antes_height + 10)],
            fill='black'
        )
        draw.text(
            (label_padding + 10, label_y + 5),
            antes_text,
            fill='white',
            font=font
        )
        
        # Etiqueta "Depois" (canto superior direito da segunda imagem)
        depois_text = "Depois"
        depois_bbox = draw.textbbox((0, 0), depois_text, font=font)
        depois_width = depois_bbox[2] - depois_bbox[0]
        depois_height = depois_bbox[3] - depois_bbox[1]
        depois_x = before_width + divider_width + after_width - depois_width - 30
        
        draw.rectangle(
            [(depois_x, label_y), (depois_x + depois_width + 20, label_y + depois_height + 10)],
            fill='black'
        )
        draw.text(
            (depois_x + 10, label_y + 5),
            depois_text,
            fill='white',
            font=font
        )
    except Exception as e:
        print(f"Erro ao adicionar etiquetas: {e}")
    
    # Converter para bytes
    output = io.BytesIO()
    combined.save(output, format='PNG', quality=95)
    output.seek(0)
    
    return output.getvalue()
