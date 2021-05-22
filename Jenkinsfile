pipeline {
  agent {
    docker {
      image 'node:9-alpine'
      args '-p 5090:5090'
    }
  }
  environment {
    vrest_version = '2.1.0' 
    vrest_uversion = '2_1_0' 
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
        sh 'npm run start &'
        sh 'mkdir -p $HOME/vrest'
        sh 'wget -O $HOME/vrest/vrest-ng-cli -q https://github.com/Optimizory/vrest-ng-cli/releases/download/v$vrest_version/vrest_ng_cli_alpine_$vrest_uversion'
        sh 'chmod +x $HOME/vrest/vrest-ng-cli'
        sh '$HOME/vrest/vrest-ng-cli run --projectdir="./test/ddt-tests" --env=default --logger=xunit'
      }
    }
  }
  post {
    always {
      junit 'vrest_logs/logs.xml'
    }
  }
}