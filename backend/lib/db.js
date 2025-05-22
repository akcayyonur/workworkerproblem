import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        console.log("🔄 Connecting to MongoDB...");
        
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is not defined");
        }

        // Atlas için daha uzun timeout
        const options = {
            serverSelectionTimeoutMS: 60000, // 60 saniye
        };

        const conn = await mongoose.connect(process.env.MONGO_URI, options);
        
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        
        return conn;
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        
        // Daha spesifik hata mesajları
        if (error.message.includes('ENOTFOUND')) {
            console.error("🔍 DNS çözümleme hatası - internet bağlantınızı kontrol edin");
        } else if (error.message.includes('authentication failed')) {
            console.error("🔍 Kimlik doğrulama hatası - kullanıcı adı/şifre kontrol edin");
        } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
            console.error("🔍 IP whitelist hatası - Atlas'ta Network Access ayarlarını kontrol edin");
            console.error("   1. Atlas'a giriş yapın");
            console.error("   2. Network Access > Add IP Address");
            console.error("   3. 'Allow Access from Anywhere' seçin (geliştirme için)");
        } else if (error.message.includes('timeout')) {
            console.error("🔍 Bağlantı zaman aşımı - network veya Atlas ayarları kontrol edin");
        }
        
        throw error;
    }
};