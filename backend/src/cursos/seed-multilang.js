const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI;
const COURSES_DIR = path.join(__dirname, 'cursosFiles');

// Lista de archivos multiidioma disponibles
const MULTILANG_FILES = [
  'ingenieria_multilang.json',
  'ciencias_exactas_multilang.json',
  'arquitectura_multilang.json',
  'psicologia_multilang.json',
  'matematicas_multilang.json',
  'filosofia_multilang.json',
  'trabajo_social_multilang.json',
  'ciencias_humanas_multilang.json'
];

async function seedMultilangCourses() {
  try {
    console.log('🔗 Conectando a MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado exitosamente\n');

    // Usar la colección 'Cursos' (case-sensitive en MongoDB)
    const db = mongoose.connection.db;
    const collection = db.collection('Cursos');

    console.log('📚 Cargando cursos multiidioma...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const filename of MULTILANG_FILES) {
      const filePath = path.join(COURSES_DIR, filename);
      
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Archivo no encontrado: ${filename}`);
        errorCount++;
        continue;
      }

      try {
        const courseData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Upsert (actualizar si existe, insertar si no)
        const result = await collection.updateOne(
          { id: courseData.id },
          { $set: courseData },
          { upsert: true }
        );

        if (result.upsertedCount > 0) {
          console.log(`✅ Insertado: ${courseData.id} (${filename})`);
        } else if (result.modifiedCount > 0) {
          console.log(`🔄 Actualizado: ${courseData.id} (${filename})`);
        } else {
          console.log(`ℹ️  Sin cambios: ${courseData.id} (${filename})`);
        }
        
        successCount++;
      } catch (error) {
        console.error(`❌ Error procesando ${filename}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Cursos procesados exitosamente: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log('='.repeat(50) + '\n');

    // Verificar documentos en la colección
    const totalDocs = await collection.countDocuments({});
    console.log(`📊 Total de documentos en colección 'Cursos': ${totalDocs}\n`);

    // Mostrar algunos ejemplos
    const samples = await collection.find({}).limit(3).toArray();
    console.log('📄 Ejemplos de cursos (primeros 3):');
    samples.forEach(doc => {
      console.log(`  - ${doc.id}: ${doc.title?.es || doc.title} (${doc.branch?.es || doc.branch || 'sin categoría'})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

// Ejecutar
seedMultilangCourses();
