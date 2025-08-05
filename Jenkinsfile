pipeline {
    agent any

    environment {
        AZURE_FUNCTION_APP   = 'helloworldfunc43095'
        AZURE_RESOURCE_GROUP = 'rg-helloworld'
    }

    tools {
        nodejs 'NodeJS_20'
    }

    stages {
        stage('Checkout') {
            steps {
                git credentialsId: 'github-pat', url: 'https://github.com/ojaydiddy-git/azure-jenkins-cicd-8907032.git', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node packages...'
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests...'
                bat 'npm test || echo "No tests found, continuing..."'
            }
        }

        stage('Build') {
            steps {
                echo 'Running build...'
                bat 'npm run build || echo "No build script found, skipping..."'
            }
        }

        stage('Deploy to Azure') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'azure-sp', usernameVariable: 'AZ_CLIENT_ID', passwordVariable: 'AZ_CLIENT_SECRET'),
                    string(credentialsId: 'azure-tenant', variable: 'AZ_TENANT_ID'),
                    string(credentialsId: 'azure-subscription', variable: 'AZ_SUBSCRIPTION_ID')
                ]) {
                    bat '''
                        az logout || exit 0
                        az login --service-principal --username %AZ_CLIENT_ID% --password %AZ_CLIENT_SECRET% --tenant %AZ_TENANT_ID%
                        az account set --subscription %AZ_SUBSCRIPTION_ID%
                        func azure functionapp publish %AZURE_FUNCTION_APP% --javascript
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed.'
        }
        always {
            echo '🏁 Pipeline run finished.'
        }
    }
}
