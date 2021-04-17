pipeline {
  agent {
    docker {
      image 'node:9-alpine'
      args '-p 5090:5090'
    }
  }
  environment {
    vrest_version = '2.0.0' 
    HOME = '.'
  }
  stages {
    stage('Build') {
      steps {
        sh 'npm install'
      }
    }
    stage('Test') { 
      steps {
        sh 'PORT=5090 npm run start &'
        sh 'npm install vrest-ng-cli@$vrest_version'
        sh 'npx vrest-ng-cli run --projectdir=./test/ddt-tests --logger=xunit' 
      }
    }
  }
  post {
    always {
      junit 'vrest_logs/logs.xml'
    }
  }
}