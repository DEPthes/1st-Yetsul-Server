import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {cors:true});

    const config = new DocumentBuilder()
        .setTitle("옛술의 전당 BackEnd API")
        .setDescription("그대들이여 감히 신들의 술에 도전하는가.")
        .setVersion("1.0")
        .addTag("app")
        .addBearerAuth({
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            name: "JWT",
            description: "enter JWT token",
            in: "header",
        },
            "accesskey",
        ).build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("docs", app, document);

    // app.enableCors();
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    await app.listen(process.env.PORT || 3000);
}
bootstrap();