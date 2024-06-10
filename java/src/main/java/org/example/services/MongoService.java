package org.example.services;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

@Service
public class MongoService extends AbstractMongoClientConfiguration {
    public MongoTemplate mongoTemplate() {
        String connectionString = "mongodb://@localhost:27017/appDataBase";
        MongoClientSettings mongoClientSettings = MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(connectionString))
                .build();
        MongoClient mongoClient = MongoClients.create(mongoClientSettings);
        System.out.println(connectionString);
        return new MongoTemplate(mongoClient, "appDataBase");
    }

    @Override
    protected String getDatabaseName() {
        return "MarketDB";
    }

    @Override
    protected boolean autoIndexCreation() {
        return true;
    }
}
