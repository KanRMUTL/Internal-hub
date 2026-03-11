import os
import re

patterns = [
    (r'<Box\s+([^>]*)\$flex\b', r'<Box \1flex'),
    (r'<Box\s+([^>]*)\$grid\b', r'<Box \1grid'),
    (r'<Box\s+([^>]*)\$display\b', r'<Box \1display'),
    (r'<Box\s+([^>]*)\$direction\b', r'<Box \1direction'),
    (r'<Box\s+([^>]*)\$align\b', r'<Box \1align'),
    (r'<Box\s+([^>]*)\$justify\b', r'<Box \1justify'),
    (r'<Box\s+([^>]*)\$gap\b', r'<Box \1gap'),
    (r'<Box\s+([^>]*)\$bg\b', r'<Box \1bg'),
    (r'<Box\s+([^>]*)\$radius\b', r'<Box \1radius'),
    (r'<Box\s+([^>]*)\$shadow\b', r'<Box \1shadow'),
    (r'<Box\s+([^>]*)\$pointer\b', r'<Box \1pointer'),
    (r'<Box\s+([^>]*)\$width\b', r'<Box \1width'),
    (r'<Box\s+([^>]*)\$height\b', r'<Box \1height'),
    (r'<Box\s+([^>]*)\$position\b', r'<Box \1position'),
    (r'<Box\s+([^>]*)\$minHeight\b', r'<Box \1minHeight'),
    (r'<Box\s+([^>]*)\$maxHeight\b', r'<Box \1maxHeight'),
    (r'<Box\s+([^>]*)\$overflowY\b', r'<Box \1overflowY'),
    (r'<Box\s+([^>]*)\$tabletP\b', r'<Box \1tabletP'),
    (r'<Box\s+([^>]*)\$desktopP\b', r'<Box \1desktopP'),
    (r'<Box\s+([^>]*)\$tabletDisplay\b', r'<Box \1tabletDisplay'),
    (r'<Box\s+([^>]*)\$p\b', r'<Box \1p'),
    (r'<Box\s+([^>]*)\$pt\b', r'<Box \1pt'),
    (r'<Box\s+([^>]*)\$pb\b', r'<Box \1pb'),
    (r'<Box\s+([^>]*)\$pl\b', r'<Box \1pl'),
    (r'<Box\s+([^>]*)\$pr\b', r'<Box \1pr'),
    (r'<Box\s+([^>]*)\$px\b', r'<Box \1px'),
    (r'<Box\s+([^>]*)\$py\b', r'<Box \1py'),
    (r'<Box\s+([^>]*)\$m\b', r'<Box \1m'),
    (r'<Box\s+([^>]*)\$mt\b', r'<Box \1mt'),
    (r'<Box\s+([^>]*)\$mb\b', r'<Box \1mb'),
    (r'<Box\s+([^>]*)\$ml\b', r'<Box \1ml'),
    (r'<Box\s+([^>]*)\$mr\b', r'<Box \1mr'),
    (r'<Box\s+([^>]*)\$mx\b', r'<Box \1mx'),
    (r'<Box\s+([^>]*)\$my\b', r'<Box \1my'),
    (r'<Box\s+([^>]*)\$touchTargets\b', r'<Box \1touchTargets'),

    (r'<Button\s+([^>]*)\$variant\b', r'<Button \1variant'),
    (r'<Button\s+([^>]*)\$size\b', r'<Button \1size'),
    (r'<Button\s+([^>]*)\$fullWidth\b', r'<Button \1fullWidth'),
    (r'<Button\s+([^>]*)\$loading\b', r'<Button \1loading'),
    (r'<Button\s+([^>]*)\$rounded\b', r'<Button \1rounded'),
    (r'<Button\s+([^>]*)\$shadow\b', r'<Button \1shadow'),

    (r'<Typography\s+([^>]*)\$color\b', r'<Typography \1color'),
    (r'<Typography\s+([^>]*)\$size\b', r'<Typography \1size'),
    (r'<Typography\s+([^>]*)\$weight\b', r'<Typography \1weight'),
    (r'<Typography\s+([^>]*)\$align\b', r'<Typography \1align'),
    (r'<Typography\s+([^>]*)\$inline\b', r'<Typography \1inline'),
    (r'<Typography\s+([^>]*)\$pointer\b', r'<Typography \1pointer'),
    (r'<Typography\s+([^>]*)\$noWrap\b', r'<Typography \1noWrap'),

    (r'<Container\s+([^>]*)\$maxWidth\b', r'<Container \1maxWidth'),
    (r'<Container\s+([^>]*)\$centered\b', r'<Container \1centered'),
    (r'<Container\s+([^>]*)\$px\b', r'<Container \1px'),
    (r'<Container\s+([^>]*)\$touchTargets\b', r'<Container \1touchTargets'),

    (r'<Card\s+([^>]*)\$padding\b', r'<Card \1padding'),
    (r'<Card\s+([^>]*)\$interactive\b', r'<Card \1interactive'),
    (r'<Card\s+([^>]*)\$shadow\b', r'<Card \1shadow'),
    (r'<Card\s+([^>]*)\$rounded\b', r'<Card \1rounded'),

    (r'<Skeleton\s+([^>]*)width\b', r'<Skeleton \1$width'),
    (r'<Skeleton\s+([^>]*)height\b', r'<Skeleton \1$height'),
    (r'<Skeleton\s+([^>]*)rounded\b', r'<Skeleton \1$rounded'),
    (r'<Skeleton\s+([^>]*)variant\b', r'<Skeleton \1$variant'),

    (r'<Modal\s+([^>]*)size\b', r'<Modal \1$size'),
]

def apply_patterns(content):
    for i in range(10): 
        new_content = content
        for pattern, replacement in patterns:
            new_content = re.sub(pattern, replacement, new_content, flags=re.DOTALL)
        if new_content == content:
            break
        content = new_content
    return content

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
            
            new_content = apply_patterns(content)
            
            if new_content != content:
                with open(path, 'w') as f:
                    f.write(new_content)
                print(f"Fixed {path}")
