# FROM --platform=amd64 node:20-slim AS base

# # Install zsh and other necessary packages
# RUN apt-get update \
#     && apt-get install -y curl python3 g++ make git zsh \
#     && apt-get -y autoclean

# SHELL ["/bin/zsh", "-c"] 

# # Create a default .zshrc file
# RUN echo "export PATH=\$PATH" > ~/.zshrc

# # Install oh-my-zsh
# RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# # Set up custom .zshrc
# RUN echo "export PATH=\$PATH:/opt/nvim-linux64/bin" >> ~/.zshrc \
#     && echo "alias :ai='npx get-response-lite'" >> ~/.zshrc

# # Ensure python3 is installed and create a symlink for python
# RUN apt-get update && apt-get install -y python3 python3-pip python3-venv \
#     && ln -s /usr/bin/python3 /usr/bin/python

# RUN apt-get update && apt-get install -y golang-go

# ENV GOPATH=/root/go
# ENV PATH=$GOPATH/bin:$PATH


# # TOOLS
# # Clone SQLMap and make it globally accessible
# # RUN git clone --depth 1 https://github.com/sqlmapproject/sqlmap.git /opt/sqlmap \
# #     && ln -s /opt/sqlmap/sqlmap.py /usr/local/bin/sqlmap \
# #     && chmod +x /usr/local/bin/sqlmap

# RUN go install github.com/tomnomnom/httprobe@latest \
#     && ln -s /root/go/bin/httprobe /usr/local/bin/httprobe


# RUN git clone --depth 1 https://github.com/s0md3v/XSStrike.git /opt/xsstrike \
#     && python3 -m venv /opt/xsstrike/venv \
#     && /opt/xsstrike/venv/bin/pip install -r /opt/xsstrike/requirements.txt \
#     && ln -s /opt/xsstrike/xsstrike.py /usr/local/bin/xsstrike \
#     && chmod +x /usr/local/bin/xsstrike

# # RUN apt-get update \
# #     && apt-get install -y curl python3 g++ make git \
# #     && apt-get -y autoclean

# # nvim
# RUN curl -LO https://github.com/neovim/neovim/releases/download/v0.9.5/nvim-linux64.tar.gz
# RUN rm -rf /opt/nvim
# RUN tar -C /opt -xzf nvim-linux64.tar.gz
# ENV PATH "$PATH:/opt/nvim-linux64/bin"
# RUN . ~/.zshrc

# ## plugin
# # RUN LV_BRANCH='release-1.4/neovim-0.9' bash <(curl -s https://raw.githubusercontent.com/LunarVim/LunarVim/release-1.4/neovim-0.9/utils/installer/install.sh)
# # RUN mv ~/.local/share/nvim ~/.local/share/nvim.bak
# # RUN mv ~/.local/state/nvim ~/.local/state/nvim.bak
# # RUN mv ~/.cache/nvim ~/.cache/nvim.bak
# RUN git clone -b enhanced --single-branch https://github.com/Debajyati/Efficienvim ~/.config/nvim
# RUN rm -rf ~/.config/nvim/.git

# # Set working directory for all build stages.
# WORKDIR /usr/src/app

# # ENV FRONTEND_URL='http://localhost:5173'

# # Install pnpm.
# RUN --mount=type=cache,target=/root/.npm \
#     npm install -g npm@10.7.0
# RUN . ~/.zshrc

# # ai
# RUN npm install -g get-response-lite latest-version
# RUN echo "alias :ai='npx get-response-lite'" >> ~/.zshrc
# RUN . ~/.zshrc


# FROM base AS build
# COPY package.json .
# # COPY pnpm-lock.yaml .
# RUN npm install

# COPY . .

# # RUN npm run build
# EXPOSE 5000

# ENTRYPOINT [ "npm" ]
# CMD [ "start" ]


# Use Kali Linux as the base image
FROM --platform=amd64 kalilinux/kali-rolling AS base

# Install necessary packages (including Node.js)
# RUN apt-get update \
#     && apt-get install -y curl python3 g++ make git zsh gnupg2 ca-certificates \
#     && apt-get install -y software-properties-common \
#     && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
#     && apt-get install -y nodejs \
#     && apt-get -y autoclean
RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y curl python3 g++ make git zsh gnupg2 ca-certificates apt-utils \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get -y autoclean

# Install zsh and oh-my-zsh
SHELL ["/bin/zsh", "-c"] 
RUN echo "export PATH=\$PATH" > ~/.zshrc \
    && sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# Set up custom .zshrc
RUN echo "export PATH=\$PATH:/opt/nvim-linux64/bin" >> ~/.zshrc \
    && echo "alias :ai='npx get-response-lite'" >> ~/.zshrc

# Ensure Python 3 and Go are installed
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv \
    && ln -s /usr/bin/python3 /usr/bin/python \
    && apt-get install -y golang-go

# Set up Go environment variables
ENV GOPATH=/root/go
ENV PATH=$GOPATH/bin:$PATH

# Install bug bounty tools
RUN go install github.com/tomnomnom/httprobe@latest \
    && ln -s /root/go/bin/httprobe /usr/local/bin/httprobe

RUN git clone --depth 1 https://github.com/s0md3v/XSStrike.git /opt/xsstrike \
    && python3 -m venv /opt/xsstrike/venv \
    && /opt/xsstrike/venv/bin/pip install -r /opt/xsstrike/requirements.txt \
    && ln -s /opt/xsstrike/xsstrike.py /usr/local/bin/xsstrike \
    && chmod +x /usr/local/bin/xsstrike


# Install Neovim
# RUN curl -LO https://github.com/neovim/neovim/releases/download/v0.9.5/nvim-linux64.tar.gz \
#     && rm -rf /opt/nvim \
#     && tar -C /opt -xzf nvim-linux64.tar.gz
# ENV PATH "$PATH:/opt/nvim-linux64/bin"
# RUN . ~/.zshrc

# Nevim plugins
# RUN LV_BRANCH='release-1.4/neovim-0.9' bash <(curl -s https://raw.githubusercontent.com/LunarVim/LunarVim/release-1.4/neovim-0.9/utils/installer/install.sh)
# RUN mv ~/.local/share/nvim ~/.local/share/nvim.bak
# RUN mv ~/.local/state/nvim ~/.local/state/nvim.bak
# RUN mv ~/.cache/nvim ~/.cache/nvim.bak
# RUN git clone -b enhanced --single-branch https://github.com/Debajyati/Efficienvim ~/.config/nvim
# RUN rm -rf ~/.config/nvim/.git

# Install Neovim
RUN curl -LO https://github.com/neovim/neovim/releases/download/v0.9.5/nvim-linux64.tar.gz \
    && rm -rf /opt/nvim \
    && tar -C /opt -xzf nvim-linux64.tar.gz
ENV PATH "$PATH:/opt/nvim-linux64/bin"
RUN . ~/.zshrc

# # Initialize Neovim once to create necessary directories
# RUN nvim --headless +qall

# # Neovim plugins (LunarVim in this case)
# RUN LV_BRANCH='release-1.4/neovim-0.9' bash <(curl -s https://raw.githubusercontent.com/LunarVim/LunarVim/release-1.4/neovim-0.9/utils/installer/install.sh)

# # Backup existing Neovim configurations
# RUN mv ~/.local/share/nvim ~/.local/share/nvim.bak || true
# RUN mv ~/.local/state/nvim ~/.local/state/nvim.bak || true
# RUN mv ~/.cache/nvim ~/.cache/nvim.bak || true

# # Install Efficienvim custom Neovim config
RUN git clone -b enhanced --single-branch https://github.com/Debajyati/Efficienvim ~/.config/nvim
RUN rm -rf ~/.config/nvim/.git

# Install Neovim
# RUN curl -LO https://github.com/neovim/neovim/releases/download/v0.9.5/nvim-linux64.tar.gz \
#     && tar -C /opt -xzf nvim-linux64.tar.gz \
#     && rm nvim-linux64.tar.gz
# ENV PATH="$PATH:/opt/nvim-linux64/bin"

# Install NvChad
# RUN git clone https://github.com/NvChad/NvChad ~/.config/nvim --depth 1

# RUN git clone https://github.com/NvChad/NvChad ~/.config/nvim --depth 1 \
#     && nvim --headless +'NvChadUpdate' +qall

# Set up a script to run the first-time setup for NvChad
# RUN echo "#!/bin/bash\n\
# nvim --headless +'autocmd User PackerComplete quitall' +'PackerSync'" > /usr/local/bin/setup-nvchad \
#     && chmod +x /usr/local/bin/setup-nvchad

# Set up NvChad with plugins
# RUN nvim --headless +'autocmd User PackerComplete quitall' +'PackerSync' \
#     && nvim --headless +'NvChadUpdate' +qall

# Install AI tools and set up alias
RUN npm install -g get-response-lite latest-version \
    && echo "alias :ai='npx get-response-lite'" >> ~/.zshrc

# Set working directory for all build stages
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm@latest
RUN . ~/.zshrc

# Install dependencies
COPY package.json .
RUN npm install

# Copy project files
COPY . .

# Expose port and define entry point
EXPOSE 5000
ENTRYPOINT [ "npm" ]
CMD [ "start" ]