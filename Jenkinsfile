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
                echo 'Running tests (3+ test cases expected)...'
                bat '''
                    call npm install --save-dev mocha
                    call npx mocha test
                    if errorlevel 1 (
                        echo Tests failed!
                        exit /b 1
                    )
                '''
            }
        }

        stage('Build') {
            steps {
                echo 'Running build...'
                bat '''
                    call npm run build
                    if errorlevel 1 (
                        echo "No build script found or build failed, skipping build stage..."
                        exit /b 0
                    )
                '''
            }
        }

        stage('Deploy to Azure') {
            steps {
                withCredentials([
                    azureServicePrincipal(
                        credentialsId: 'azure-tenant',
                        subscriptionIdVariable: 'AZ_SUBSCRIPTION_ID',
                        clientIdVariable: 'AZ_CLIENT_ID',
                        clientSecretVariable: 'AZ_CLIENT_SECRET',
                        tenantIdVariable: 'AZ_TENANT_ID'
                    )
                ]) {
                    bat '''
                        call az logout || exit 0
                        call az login --service-principal --username %AZ_CLIENT_ID% --password %AZ_CLIENT_SECRET% --tenant %AZ_TENANT_ID%
                        call az account set --subscription %AZ_SUBSCRIPTION_ID%
                        call func azure functionapp publish %AZURE_FUNCTION_APP% --javascript
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
