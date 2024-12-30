# Script to list all folder names in the given path

path="$HOME/shells"

# Check if the directory exists
if [ ! -d "$path" ]; then
#   echo "Directory $path does not exist."
  exit 0
fi

# Get all folder names in the path
folders=$(ls -d "$path"/*/ 2>/dev/null | xargs -n 1 basename)

if [ -z "$folders" ]; then
#   echo "No folders found in the path '$path'."
  echo ""
else
#   echo "Folders in the path '$path':"
  echo "$folders"
fi