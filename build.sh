echo "Building backend..."
docker build -t project/backend:latest ./java
if [ $? -ne 0 ]; then
  echo "Backend build failed"
  exit 1
fi

echo "Building frontend..."
docker build -t project/frontend:latest ./react
if [ $? -ne 0 ]; then
  echo "Frontend build failed"
  exit 1
fi
