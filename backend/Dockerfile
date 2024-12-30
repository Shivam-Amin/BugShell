
# Use Kali Linux as the base image
FROM --platform=amd64 kalilinux/kali-rolling AS base

# Install necessary packages (including Node.js)
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
RUN curl -LO https://github.com/neovim/neovim/releases/download/v0.9.5/nvim-linux64.tar.gz \
    && rm -rf /opt/nvim \
    && tar -C /opt -xzf nvim-linux64.tar.gz
ENV PATH "$PATH:/opt/nvim-linux64/bin"
RUN . ~/.zshrc

# # Install Efficienvim custom Neovim config
RUN git clone -b enhanced --single-branch https://github.com/Debajyati/Efficienvim ~/.config/nvim
RUN rm -rf ~/.config/nvim/.git

# Install AI tools and set up alias
RUN npm install -g get-response-lite latest-version \
    && echo "alias :ai='npx get-response-lite'" >> ~/.zshrc

# Set working directory for all build stages
WORKDIR /usr/src/app

# Install dependencies
COPY package.json .
RUN npm install

# Copy project files
COPY . .

# Expose port and define entry point
EXPOSE 5000
ENTRYPOINT [ "npm" ]
CMD [ "start" ]