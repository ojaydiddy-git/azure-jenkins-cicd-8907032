pipeline {
    agent any

    environment {
        AZURE_FUNCTION_APP   = 'helloworldfunc43095'
        AZURE_RESOURCE_GROUP = 'rg-helloworld'
    }

    tools {
        nodejs 'NodeJS_20' // Must match the NodeJS name configured in Jenkins
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
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests...'
                sh '''
                    if [ -f package.json ] && grep -q test package.json; then
                        npm test
                    else
                        echo "No test script found. Skipping tests..."
                    fi
                '''
            }
        }

        stage('Build') {
            steps {
                echo 'Building project...'
                sh 'npm run build || echo "No build step defined. Skipping..."'
            }
        }

        stage('Deploy to Azure') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'azure-sp', usernameVariable: 'AZ_CLIENT_ID', passwordVariable: 'AZ_CLIENT_SECRET'),
                    string(credentialsId: 'azure-tenant', variable: 'AZ_TENANT_ID'),
                    string(credentialsId: 'azure-subscription', variable: 'AZ_SUBSCRIPTION_ID')
                ]) {
                    sh '''
                        echo "Logging into Azure..."
                        az logout || true
                        az login --service-principal \
                            --username $AZ_CLIENT_ID \
                            --password $AZ_CLIENT_SECRET \
                            --tenant $AZ_TENANT_ID

                        az account set --subscription $AZ_SUBSCRIPTION_ID

                        echo "Deploying Azure Function..."
                        func azure functionapp publish $AZURE_FUNCTION_APP --javascript
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ CI/CD Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed.'
        }
        always {
            echo '🏁 Pipeline run finished.'
        }
    }
}
