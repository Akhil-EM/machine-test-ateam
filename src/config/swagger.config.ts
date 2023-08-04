import { DocumentBuilder } from '@nestjs/swagger';
export const swaggerConfig = new DocumentBuilder()
  .setTitle('Name')
  .setDescription(
    `All the **success** responses have the following response body.
  \`\`\`
  {
    "url": "/user",
    "timestamp": "2023-05-05T15:42:00.189Z",
    "statusCode": 200,
    "isError": false,
    "message": "",
    "data": {}
  }
  \`\`\`
  All the ***error*** responses have following response body.
  \`\`\`
  {
    "url": "/user",
    "timeStamps": "2023-05-05T15:44:28.281Z",
    "statusCode": 404,
    "isError": true,
    "errors": [ ]
  }
  \`\`\`
  if ***isError*** is **true** which indicating an error.`,
  )
  .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    'access-token',
  )
  .setVersion('0.1')
  .build();
