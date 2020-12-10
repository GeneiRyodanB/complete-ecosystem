node {
    docker.image('maven:3.6.3-jdk-11').inside('-v $HOME/.m2:/root/.m2') {
        stage('Pull repository') {
            checkout scm
        }
        stage('Build') {
            sh 'mvn -B -DskipTests clean package -f ./server'
        }
        stage('Test') {
            sh 'mvn test -f ./server'
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
        def customImage = docker.build("geneiryodan/basic-server:${env.BUILD_ID}")
        customImage.push()
        customImage.push('latest')
    }
}