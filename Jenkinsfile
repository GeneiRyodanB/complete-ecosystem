node {
    docker.image('maven:3.6.3-jdk-11').inside('-v $HOME/.m2:/root/.m2') {
        stage('Pull repository') {
            checkout scm
        }
        stage('Build') {
            sh 'mvn -B -DskipTests clean package -f server/'
        }
        stage('Test') {
            sh 'mvn test -f server/'
        }
        stage('Stash jar file') {
            stash includes: 'server/target/server-0.0.1-SNAPSHOT.jar', name: 'binary'
        }
    }
}
node {
    stage('Unstash jar file') {
        unstash 'binary'
    }
    stage('build and push Docker image') {
        def customImage = docker.build("geneiryodan/basic-server:${env.BUILD_ID}", "server")
        docker.withRegistry('http://registry.hub.docker.com', 'docker-registery'){
            customImage.push()
            customImage.push('latest')
        }
        
    }
}

node {
  stage('Build ng image') {
    def customNodeImage = docker.build("node-with-ng", "client")
    customNodeImage.inside {
      withEnv([
        /* Override the npm cache directory to avoid: EACCES: permission denied, mkdir '/.npm' */
        'npm_config_cache=npm-cache',
        /* set home to our current directory because other bower
        * nonsense breaks with HOME=/, e.g.:
        * EACCES: permission denied, mkdir '/.config'
        */
        'HOME=.',
      ]) {
        stage('Pull repository') {
          checkout scm
        }
        stage('Install npm') {
          sh 'npm install --prefix client client'
        }
        stage('Build') {
          sh 'npm run build --prod --prefix client'
        }
        stage('Stash dist folder') {
          stash includes: 'client/dist/**/*', name: 'distFolder'
        }
      }

      
    }
  }
}
node {
  stage('Unstash dist folder') {
    unstash 'distFolder'
  }
  stage('Build Docker image') {
    def customImage = docker.build("geneiryodan/basic-client:${env.BUILD_ID}", "client/dockerfiles/nginx")
    stage('Push Docker image'){
      docker.withRegistry('http://registry.hub.docker.com', 'docker-registery'){
            customImage.push()
            customImage.push('latest')
        }
    }
  }
}
