# Use the specified base image
FROM python:3.10

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Create and set the working directory
WORKDIR /app

# install of our python dependencies from requirements.txt by copying the file into the woking directory first
COPY requirements.txt /app/ 
RUN pip install --upgrade pip && pip install -r requirements.txt

# take the current directory and copy all of the files into the container
COPY . /app/

# copy the entrypoint script and make it executable
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
