node {
  // stage('Who am I') {
  //   sh 'whoami'
  // }
  docker.image('maven:3.6.3-jdk-11').inside('-v /var/lib/jenkins/.m2:/root/.m2') {
    withEnv([
        /* Override the npm cache directory to avoid: EACCES: permission denied, mkdir '/.npm' */
        'NEXUS_VERSION="nexus3"',
        'NEXUS_PROTOCOL="http"',
        'NEXUS_URL="3.88.163.197:8081"',
        'NEXUS_REPOSITORY="repository-example"',
        'NEXUS_CREDENTIALS_ID="nexus-credentials"'
        /* set home to our current directory because other bower
        * nonsense breaks with HOME=/, e.g.:
        * EACCES: permission denied, mkdir '/.config'
        */
        //'HOME=.',
      ]) {
        stage('Pull repository') {
            checkout scm
        }
        /*stage('pwd') {
            sh 'pwd'
        }*/
        stage('Build') {
            sh 'mvn -B -DskipTests clean package -f server/'
        }
        stage('Test') {
            sh 'mvn test -f server/'
        }
        stage('publish to nexus') {
          //steps {
            //script {
              pom = readMavenPom file: "server/pom.xml";
              filesByGlob = findFiles(glob: "server/target/*.${pom.packaging}");
              echo "${filesByGlob[0].name} ${filesByGlob[0].path} ${filesByGlob[0].directory} ${filesByGlob[0].length} ${filesByGlob[0].lastModified}"
              artifactPath = filesByGlob[0].path;
              artifactExists = fileExists artifactPath

              if(artifactExists) {
                echo "*** File: ${artifactPath}, group: ${pom.groupId}, packaging: ${pom.packaging}, version: ${pom.version}";

                nexusArtifactUploader(
                  nexusVersion: "nexus3",
                  protocol: "http",
                  nexusUrl: "3.88.163.197:8081",
                  groupId: pom.groupId,
                  version: pom.version,
                  repository: "repository-example",
                  credentialsId: "nexus-credentials",
                  artifacts: [
                    [artifactId: pom.artifactId,
                    classifier: '',
                    file: artifactPath,
                    type: pom.packaging],

                    [artifactId: pom.artifactId,
                    classifier: '',
                    file: "server/pom.xml",
                    type: "pom"],
                  ]
                )
              } else {
                error "*** File: ${artifactPath}, could not be found";
              }
            //}
          //}
        }

        stage('Stash jar file') {
            stash includes: 'server/target/server-0.0.1-SNAPSHOT.jar', name: 'binary'
        }
      }
  }
}
node {
    // stage('Who am I') {
    //   sh 'whoami'
    // }
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

node('test') {
  // stage('Who am I') {
  //   sh 'whoami'
  // }
  stage('Pull repository') {
    checkout scm
  }
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
        //'HOME=.',
      ]) {
        stage('Pull repository') {
          checkout scm
        }
        stage('Install npm') {
          sh 'npm install --prefix ./client ./client'
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
    def customImage = docker.build("geneiryodan/basic-client:${env.BUILD_ID}", "-f ./client/dockerfiles/nginx/Dockerfile ./client")
    stage('Push Docker image'){
      docker.withRegistry('http://registry.hub.docker.com', 'docker-registery'){
            customImage.push()
            customImage.push('latest')
        }
    }
  }
}
