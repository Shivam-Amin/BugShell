#!/bin/bash

# Example usage
path="$HOME/shells"
folder_name="$1"

echo "$folder_name"

# Check if the directory exists
if [ -d "$path" ]; then
  # Create the directory if it doesn't exist
#   mkdir -p "$path"
#   echo "Directory $path created."

    folder_path="$path/$folder_name"

    # Check if the folder exists
    if [ -d "$folder_path" ]; then
        rm -rf $folder_path
        echo "The folder '$folder_name' exists in the path '$path'."
        exit 0
    else
      # mkdir "$folder_path"
      # if [ $? -eq 0 ]; then
      #     echo "Folder created successful."
      # else
      #     echo "Folder is not created! error occured."
      # fi
      echo "No such shell exists!"
      exit 1
    fi
fi



# Call the function
# check_folder_exists "$path" "$folder_name"