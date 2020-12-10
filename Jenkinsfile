node {
    docker.image('maven:3-alpine').inside('-v $HOME/.m2:/root/.m2') {
        stage('Pull repository') {
            checkout scm
        }
        stage('Build') {
            sh 'mvn -B -DskipTests clean package /server'
        }
        stage('Test') {
            sh 'mvn test'
        }
        stage('Stash jar file') {
            stash includes: 'target/server-0.0.1-SNAPSHOT.jar', name: 'binary'
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