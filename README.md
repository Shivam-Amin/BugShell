# BugShell  

**BugShell** is a web-based terminal project built specifically for bug bounty hunters. It provides  CLI interface where users can **run  bug bounty cli-tools** and easily extend functionality by adding their own scripts. The project leverages Docker to ensure seamless setup.

## **✨** Features  
- **🖥️ Web-based Terminal**: A browser-accessible terminal interface using **`xterm.js`**.  
- **⚙️ Preloaded Tool**: The project comes with **sqlmap** pre-configured as an example tool.  
- **🔧 Extensibility**: Easily **add more tools** by following the provided script setup. *(Do check how to set up your own tools below.)*
- **🐳 Dockerized Environment**: Run the entire project with a single command using **`docker-compose`**.  


## 💡 About the Idea!

**BugShell** is more than just a terminal — it’s an **idea** aimed at creating something **new and different** for the bug bounty community. The project is designed to simplify workflows, enhance productivity, and unify essential tools into a user-friendly, browser-accessible interface.

This is just the beginning! **BugShell** can be **extended and improved** with more tools, features, and capabilities to meet the evolving needs of bug bounty hunters.

**📢 Have ideas?**
If you have **ideas** or **features** that could make an impact, or if _you’d like to contribute_, I’d love to hear from you! Collaboration is key.

## 🚀 Getting Started  

#### 🛠️ Prerequisites  :
Make sure you have installed:  
- [🐳 Docker](https://www.docker.com/)  
- [📦 Docker Compose](https://docs.docker.com/compose/)  
---

### 🔧 Installation  :

1. Fork this repo.
2. Clone the forked repository (from your profile):  
	```bash
	git clone https://github.com/<your-user-name>/BugShell.git
	cd BugShell
	```

3. Run the project using *Docker Compose:*
	```bash
	docker-compose up
	```
	This will pull all necessary images, set up containers, and run the project.
	**Note: For the first time, it may take 1-2 min. to setup.**
	
4. Add **`.env`** file in the root directory of your project folder, you need to set below variables:
	```bash
	JWT_SECRET='any-string'
	MYSQL_ROOT_PASSWORD='password'
	MYSQL_DATABASE='bugshell'
	MYSQL_USER='user'
	MYSQL_PASSWORD='password'
	MYSQL_URL_DOCKER='mysql://user:password@mysql_db:3306/bugshell'
	```
	Feel free to change the values as you want.
	
5. As per your system, also change the platform in **`./docker-compose.yaml`** file.

6. 🌐 The project should now be up and running on below url:
	```link
	http://localhost:5173
	```

## How to set-up your own tools!

 1. Goto **`./backend/scripts`**.
 
 2. Open **`setup_tools.sh`** file.

 3. For the example, sqlmap tool is already added which you can access through running website.
	**Note:** Do add **`&> /dev/null`** in end of each line, which may give any output on console.

 4. Finally, remove all containers and images and run **`docker-compose up`** again from **`./`**
	- Mainly, the following **3 containers and 3 images** will be created:
		 - bugshell-frontend
		 - bugshell-backend
		 - mysql
