package:
	rm -rf emgudotdev-express.zip
	zip -r emgudotdev-express.zip .

deploy:
	aws s3 cp emgudotdev-express.zip s3://emgudev-portfolio/
