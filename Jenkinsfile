pipeline {
  agent {
    docker {
      image 'node:9'
      args '-p 5090:5090'
    }
  }
  environment {
    vrest_version = '1.9.2' 
    vrest_uversion = '1_9_2' 
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
        sh 'wget -O $HOME/vrest/vrest-ng-cli -q https://github.com/Optimizory/vrest-ng-cli/releases/download/v$vrest_version/vrest_ng_cli_linux_$vrest_uversion'
        sh 'chmod +x $HOME/vrest/vrest-ng-cli 2>&1 > $HOME/a.txt'
        sh 'cat $HOME/a.txt'
        sh '$HOME/vrest/vrest-ng-cli run --projectdir="./test/ddt-tests --env=default --logger=xunit 2>&1 > $HOME/b.txt'
        sh 'cat $HOME/b.txt'
      }
    }
  }
  post {
    always {
      junit 'vrest_logs/logs.xml'
    }
  }
}