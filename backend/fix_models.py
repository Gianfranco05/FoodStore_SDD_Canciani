"""Fix all models to add max_length to String fields for MySQL compatibility"""
import os
import re

backend_path = r"C:\Users\Usuario\Documents\Gestion\FoodStore\RepositorioBaseFoodStore-SDD\backend"

# Find all model files
model_files = []
for root, dirs, files in os.walk(backend_path):
    for file in files:
        if file == "models.py":
            model_files.append(os.path.join(root, file))

print(f"Found {len(model_files)} model files")

for model_file in model_files:
    print(f"\nProcessing: {model_file}")
    with open(model_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find fields without max_length
    # Pattern: Field( that doesn't contain max_length
    # We need to add max_length to Optional[str] fields and str fields without it
    
    # Simple approach: find lines with ": str = Field(" that don't have max_length
    lines = content.split('\n')
    modified = False
    
    for i, line in enumerate(lines):
        # Skip if already has max_length
        if 'max_length' in line:
            continue
            
        # Check if this is a str field with Field()
        if ': str = Field(' in line or ': Optional[str] = Field(' in line:
            # Check if the Field() doesn't have max_length
            field_match = re.search(r'Field\(', line)
            if field_match:
                # Add max_length=255 before the closing )
                # Find the last ) on this line that closes Field(
                # Simple approach: just add max_length=255 as first arg
                if 'max_length' not in line:
                    # Insert max_length=255 after Field(
                    new_line = line.replace('Field(', 'Field(max_length=255, ')
                    lines[i] = new_line
                    modified = True
                    print(f"  Fixed line {i+1}: Added max_length=255")
    
    if modified:
        with open(model_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))
        print(f"  -> Saved changes to {model_file}")
    else:
        print(f"  -> No changes needed")

print("\nDone! Now regenerate the migration.")
