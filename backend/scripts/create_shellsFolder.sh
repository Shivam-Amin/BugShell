#!/bin/bash

# # Function to check if a folder exists in the given path
# check_folder_exists() {
#   local path=$1
#   local folder_name=$2
#   local folder_path="$path/$folder_name"
  
#   # Check if the folder exists
#   if [ -d "$folder_path" ]; then
#     echo "The folder '$folder_name' exists in the path '$path'."
#     return 0
#   else
#     echo "The folder '$folder_name' does not exist in the path '$path'."
#     return 1
#   fi
# }

# Example usage
path="$HOME/shells"
folder_name="$1"

echo "$folder_name"

# Check if the directory exists
if [ ! -d "$path" ]; then
  # Create the directory if it doesn't exist
  mkdir -p "$path"
  echo "Directory $path created."
fi

folder_path="$path/$folder_name"

# Check if the folder exists
if [ -d "$folder_path" ]; then
  echo "The folder '$folder_name' exists in the path '$path'."
  
else
  mkdir "$folder_path"
  if [ $? -eq 0 ]; then
      echo "Folder created successful."
      exit 0
  else
      echo "Folder is not created! error occured."
      exit 0
  fi
fi

# Call the function
# check_folder_exists "$path" "$folder_name"