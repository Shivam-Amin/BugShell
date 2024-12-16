full_path="$HOME/Tools"

# Check if the tools folder exists
if [ -d "$full_path" ]; then
    echo "Tools: already set."
    exit 0
# Create the folder
else
    mkdir "$full_path"

    # Setup SQLMap
    cd $HOME/Tools
    git clone --depth 1 https://github.com/sqlmapproject/sqlmap.git &> /dev/null
    # Make sqlmap.py executable
    chmod +x $full_path/sqlmap/sqlmap.py
    ln -s $full_path/sqlmap/sqlmap.py /usr/local/bin/sqlmap

    # # Setup Subfinder
    # git clone https://github.com/projectdiscovery/subfinder.git &> /dev/null
    # cd subfinder/v2/cmd/subfinder
    # go build &> /dev/null
    # chmod +x subfinder
    # mv subfinder /usr/local/bin

    # # Setup httprobe
    # cd $HOME/Tools
    # git clone https://github.com/tomnomnom/httprobe.git &> /dev/null
    # cd httprobe
    # go build &> /dev/null
    # chmod +x httprobe
    # mv httprobe /usr/local/bin


    if [ $? -eq 0 ]; then
        echo "tool setup finished!"
        exit 0
    else
        echo "Error during tool-setup."
        exit 1
    fi
fi

# echo "setup file execution finished!" 
# exit 0
