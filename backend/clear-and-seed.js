import mongoose from "mongoose";

// MongoDB URI direkt tanımlandı
const MONGO_URI = "mongodb+srv://akcayyonur:f03AJSmcFgS15UIt@cluster0.xl7ltqb.mongodb.net/worker_db?retryWrites=true&w=majority&appName=Cluster0";

const AllocationCost = mongoose.model("allocation_costs", new mongoose.Schema({}, { strict: false }));
const ResourceConsumption = mongoose.model("resource_consumption", new mongoose.Schema({}, { strict: false }));
const ResourceLimit = mongoose.model("resource_limits", new mongoose.Schema({}, { strict: false }));
const SolutionLog = mongoose.model("solutions", new mongoose.Schema({}, { strict: false }));

async function clearAndSeed() {
  try {
    console.log("🔍 MongoDB'ye bağlanılıyor...");
    
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB'ye bağlandı");

    // 🧹 TÜM VERİLERİ TEMİZLE
    console.log("🧹 Tüm veriler temizleniyor...");
    
    await AllocationCost.deleteMany({});
    console.log("   ✅ allocation_costs temizlendi");
    
    await ResourceConsumption.deleteMany({});
    console.log("   ✅ resource_consumption temizlendi");
    
    await ResourceLimit.deleteMany({});
    console.log("   ✅ resource_limits temizlendi");
    
    await SolutionLog.deleteMany({});
    console.log("   ✅ solutions temizlendi");

    // 📊 YENİ VERİLERİ EKLE (8 Ajan, 12 İş)
    console.log("\n📊 Yeni veriler ekleniyor...");

    // Allocation Costs
    const allocationCosts = [
      // Ajan 1
      {agent_id: 1, job_id: 1, cost: 12}, {agent_id: 1, job_id: 2, cost: 15}, {agent_id: 1, job_id: 3, cost: 18}, {agent_id: 1, job_id: 4, cost: 14},
      {agent_id: 1, job_id: 5, cost: 16}, {agent_id: 1, job_id: 6, cost: 13}, {agent_id: 1, job_id: 7, cost: 19}, {agent_id: 1, job_id: 8, cost: 11},
      {agent_id: 1, job_id: 9, cost: 17}, {agent_id: 1, job_id: 10, cost: 15}, {agent_id: 1, job_id: 11, cost: 20}, {agent_id: 1, job_id: 12, cost: 14},
      
      // Ajan 2
      {agent_id: 2, job_id: 1, cost: 8}, {agent_id: 2, job_id: 2, cost: 10}, {agent_id: 2, job_id: 3, cost: 22}, {agent_id: 2, job_id: 4, cost: 9},
      {agent_id: 2, job_id: 5, cost: 25}, {agent_id: 2, job_id: 6, cost: 7}, {agent_id: 2, job_id: 7, cost: 28}, {agent_id: 2, job_id: 8, cost: 6},
      {agent_id: 2, job_id: 9, cost: 12}, {agent_id: 2, job_id: 10, cost: 11}, {agent_id: 2, job_id: 11, cost: 30}, {agent_id: 2, job_id: 12, cost: 9},
      
      // Ajan 3
      {agent_id: 3, job_id: 1, cost: 20}, {agent_id: 3, job_id: 2, cost: 16}, {agent_id: 3, job_id: 3, cost: 8}, {agent_id: 3, job_id: 4, cost: 25},
      {agent_id: 3, job_id: 5, cost: 9}, {agent_id: 3, job_id: 6, cost: 18}, {agent_id: 3, job_id: 7, cost: 7}, {agent_id: 3, job_id: 8, cost: 23},
      {agent_id: 3, job_id: 9, cost: 10}, {agent_id: 3, job_id: 10, cost: 21}, {agent_id: 3, job_id: 11, cost: 6}, {agent_id: 3, job_id: 12, cost: 19},
      
      // Ajan 4
      {agent_id: 4, job_id: 1, cost: 11}, {agent_id: 4, job_id: 2, cost: 13}, {agent_id: 4, job_id: 3, cost: 15}, {agent_id: 4, job_id: 4, cost: 12},
      {agent_id: 4, job_id: 5, cost: 14}, {agent_id: 4, job_id: 6, cost: 10}, {agent_id: 4, job_id: 7, cost: 16}, {agent_id: 4, job_id: 8, cost: 9},
      {agent_id: 4, job_id: 9, cost: 13}, {agent_id: 4, job_id: 10, cost: 11}, {agent_id: 4, job_id: 11, cost: 17}, {agent_id: 4, job_id: 12, cost: 12},
      
      // Ajan 5
      {agent_id: 5, job_id: 1, cost: 10}, {agent_id: 5, job_id: 2, cost: 24}, {agent_id: 5, job_id: 3, cost: 12}, {agent_id: 5, job_id: 4, cost: 26},
      {agent_id: 5, job_id: 5, cost: 11}, {agent_id: 5, job_id: 6, cost: 22}, {agent_id: 5, job_id: 7, cost: 13}, {agent_id: 5, job_id: 8, cost: 8},
      {agent_id: 5, job_id: 9, cost: 27}, {agent_id: 5, job_id: 10, cost: 9}, {agent_id: 5, job_id: 11, cost: 14}, {agent_id: 5, job_id: 12, cost: 25},
      
      // Ajan 6
      {agent_id: 6, job_id: 1, cost: 9}, {agent_id: 6, job_id: 2, cost: 11}, {agent_id: 6, job_id: 3, cost: 13}, {agent_id: 6, job_id: 4, cost: 10},
      {agent_id: 6, job_id: 5, cost: 12}, {agent_id: 6, job_id: 6, cost: 8}, {agent_id: 6, job_id: 7, cost: 14}, {agent_id: 6, job_id: 8, cost: 7},
      {agent_id: 6, job_id: 9, cost: 11}, {agent_id: 6, job_id: 10, cost: 9}, {agent_id: 6, job_id: 11, cost: 15}, {agent_id: 6, job_id: 12, cost: 10},
      
      // Ajan 7
      {agent_id: 7, job_id: 1, cost: 18}, {agent_id: 7, job_id: 2, cost: 20}, {agent_id: 7, job_id: 3, cost: 5}, {agent_id: 7, job_id: 4, cost: 22},
      {agent_id: 7, job_id: 5, cost: 6}, {agent_id: 7, job_id: 6, cost: 19}, {agent_id: 7, job_id: 7, cost: 4}, {agent_id: 7, job_id: 8, cost: 21},
      {agent_id: 7, job_id: 9, cost: 7}, {agent_id: 7, job_id: 10, cost: 23}, {agent_id: 7, job_id: 11, cost: 5}, {agent_id: 7, job_id: 12, cost: 20},
      
      // Ajan 8
      {agent_id: 8, job_id: 1, cost: 25}, {agent_id: 8, job_id: 2, cost: 4}, {agent_id: 8, job_id: 3, cost: 30}, {agent_id: 8, job_id: 4, cost: 3},
      {agent_id: 8, job_id: 5, cost: 28}, {agent_id: 8, job_id: 6, cost: 5}, {agent_id: 8, job_id: 7, cost: 32}, {agent_id: 8, job_id: 8, cost: 26},
      {agent_id: 8, job_id: 9, cost: 6}, {agent_id: 8, job_id: 10, cost: 29}, {agent_id: 8, job_id: 11, cost: 4}, {agent_id: 8, job_id: 12, cost: 27}
    ];

    // Resource Consumption
    const resourceConsumption = [
      // Ajan 1
      {agent_id: 1, job_id: 1, consumption: 6}, {agent_id: 1, job_id: 2, consumption: 8}, {agent_id: 1, job_id: 3, consumption: 9}, {agent_id: 1, job_id: 4, consumption: 7},
      {agent_id: 1, job_id: 5, consumption: 8}, {agent_id: 1, job_id: 6, consumption: 6}, {agent_id: 1, job_id: 7, consumption: 10}, {agent_id: 1, job_id: 8, consumption: 5},
      {agent_id: 1, job_id: 9, consumption: 9}, {agent_id: 1, job_id: 10, consumption: 7}, {agent_id: 1, job_id: 11, consumption: 11}, {agent_id: 1, job_id: 12, consumption: 7},
      
      // Ajan 2
      {agent_id: 2, job_id: 1, consumption: 4}, {agent_id: 2, job_id: 2, consumption: 5}, {agent_id: 2, job_id: 3, consumption: 12}, {agent_id: 2, job_id: 4, consumption: 4},
      {agent_id: 2, job_id: 5, consumption: 13}, {agent_id: 2, job_id: 6, consumption: 3}, {agent_id: 2, job_id: 7, consumption: 15}, {agent_id: 2, job_id: 8, consumption: 3},
      {agent_id: 2, job_id: 9, consumption: 6}, {agent_id: 2, job_id: 10, consumption: 5}, {agent_id: 2, job_id: 11, consumption: 16}, {agent_id: 2, job_id: 12, consumption: 4},
      
      // Ajan 3
      {agent_id: 3, job_id: 1, consumption: 10}, {agent_id: 3, job_id: 2, consumption: 8}, {agent_id: 3, job_id: 3, consumption: 4}, {agent_id: 3, job_id: 4, consumption: 12},
      {agent_id: 3, job_id: 5, consumption: 4}, {agent_id: 3, job_id: 6, consumption: 9}, {agent_id: 3, job_id: 7, consumption: 3}, {agent_id: 3, job_id: 8, consumption: 11},
      {agent_id: 3, job_id: 9, consumption: 5}, {agent_id: 3, job_id: 10, consumption: 10}, {agent_id: 3, job_id: 11, consumption: 3}, {agent_id: 3, job_id: 12, consumption: 9},
      
      // Ajan 4
      {agent_id: 4, job_id: 1, consumption: 5}, {agent_id: 4, job_id: 2, consumption: 6}, {agent_id: 4, job_id: 3, consumption: 7}, {agent_id: 4, job_id: 4, consumption: 6},
      {agent_id: 4, job_id: 5, consumption: 7}, {agent_id: 4, job_id: 6, consumption: 5}, {agent_id: 4, job_id: 7, consumption: 8}, {agent_id: 4, job_id: 8, consumption: 4},
      {agent_id: 4, job_id: 9, consumption: 6}, {agent_id: 4, job_id: 10, consumption: 5}, {agent_id: 4, job_id: 11, consumption: 8}, {agent_id: 4, job_id: 12, consumption: 6},
      
      // Ajan 5
      {agent_id: 5, job_id: 1, consumption: 5}, {agent_id: 5, job_id: 2, consumption: 12}, {agent_id: 5, job_id: 3, consumption: 6}, {agent_id: 5, job_id: 4, consumption: 13},
      {agent_id: 5, job_id: 5, consumption: 5}, {agent_id: 5, job_id: 6, consumption: 11}, {agent_id: 5, job_id: 7, consumption: 6}, {agent_id: 5, job_id: 8, consumption: 4},
      {agent_id: 5, job_id: 9, consumption: 14}, {agent_id: 5, job_id: 10, consumption: 4}, {agent_id: 5, job_id: 11, consumption: 7}, {agent_id: 5, job_id: 12, consumption: 12},
      
      // Ajan 6
      {agent_id: 6, job_id: 1, consumption: 4}, {agent_id: 6, job_id: 2, consumption: 5}, {agent_id: 6, job_id: 3, consumption: 6}, {agent_id: 6, job_id: 4, consumption: 5},
      {agent_id: 6, job_id: 5, consumption: 6}, {agent_id: 6, job_id: 6, consumption: 4}, {agent_id: 6, job_id: 7, consumption: 7}, {agent_id: 6, job_id: 8, consumption: 3},
      {agent_id: 6, job_id: 9, consumption: 5}, {agent_id: 6, job_id: 10, consumption: 4}, {agent_id: 6, job_id: 11, consumption: 7}, {agent_id: 6, job_id: 12, consumption: 5},
      
      // Ajan 7
      {agent_id: 7, job_id: 1, consumption: 9}, {agent_id: 7, job_id: 2, consumption: 10}, {agent_id: 7, job_id: 3, consumption: 2}, {agent_id: 7, job_id: 4, consumption: 11},
      {agent_id: 7, job_id: 5, consumption: 3}, {agent_id: 7, job_id: 6, consumption: 9}, {agent_id: 7, job_id: 7, consumption: 2}, {agent_id: 7, job_id: 8, consumption: 10},
      {agent_id: 7, job_id: 9, consumption: 3}, {agent_id: 7, job_id: 10, consumption: 11}, {agent_id: 7, job_id: 11, consumption: 2}, {agent_id: 7, job_id: 12, consumption: 10},
      
      // Ajan 8
      {agent_id: 8, job_id: 1, consumption: 12}, {agent_id: 8, job_id: 2, consumption: 2}, {agent_id: 8, job_id: 3, consumption: 15}, {agent_id: 8, job_id: 4, consumption: 1},
      {agent_id: 8, job_id: 5, consumption: 14}, {agent_id: 8, job_id: 6, consumption: 2}, {agent_id: 8, job_id: 7, consumption: 16}, {agent_id: 8, job_id: 8, consumption: 13},
      {agent_id: 8, job_id: 9, consumption: 3}, {agent_id: 8, job_id: 10, consumption: 14}, {agent_id: 8, job_id: 11, consumption: 2}, {agent_id: 8, job_id: 12, consumption: 13}
    ];

    // Resource Limits
    const resourceLimits = [
      {agent_id: 1, limit: 25}, {agent_id: 2, limit: 20}, {agent_id: 3, limit: 22}, {agent_id: 4, limit: 24},
      {agent_id: 5, limit: 18}, {agent_id: 6, limit: 21}, {agent_id: 7, limit: 23}, {agent_id: 8, limit: 30}
    ];

    // Verileri ekle
    await AllocationCost.insertMany(allocationCosts);
    console.log(`   ✅ ${allocationCosts.length} allocation costs eklendi`);

    await ResourceConsumption.insertMany(resourceConsumption);
    console.log(`   ✅ ${resourceConsumption.length} resource consumption eklendi`);

    await ResourceLimit.insertMany(resourceLimits);
    console.log(`   ✅ ${resourceLimits.length} resource limits eklendi`);

    // Özet
    console.log("\n🎯 YENİ VERİ ÖZETİ:");
    console.log(`   📊 8 Ajan, 12 İş (96 kombinasyon)`);
    console.log(`   💰 Maliyet aralığı: 3-32`);
    console.log(`   🔋 Kaynak aralığı: 1-16`);
    console.log(`   ⚡ Kapasite aralığı: 18-30`);
    
    console.log("\n✅ Database başarıyla güncellendi!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Hata:", error.message);
    process.exit(1);
  }
}

clearAndSeed();