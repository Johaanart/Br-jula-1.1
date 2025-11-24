require('dotenv').config({ path: '../../.env' });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const introductions = require('./career-introductions.json');

const careerToFile = {
  'ingenieria': 'ingenieria_multilang.json',
  'arquitectura': 'arquitectura_multilang.json',
  'matematicas': 'matematicas_multilang.json',
  'psicologia': 'psicologia_multilang.json',
  'filosofia': 'filosofia_multilang.json',
  'trabajo-social': 'trabajo_social_multilang.json'
};

const categoryToFile = {
  'ciencias-exactas': 'ciencias_exactas_multilang.json',
  'ciencias-humanas': 'ciencias_humanas_multilang.json'
};

async function updateIntroductions() {
  console.log('📝 Actualizando introducciones de carreras y categorías...\n');
  
  // Actualizar archivos de carreras
  for (const [career, filename] of Object.entries(careerToFile)) {
    const filePath = path.join(__dirname, 'cursosFiles', filename);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (introductions[career]) {
      // Agregar campo intro al curso
      data.intro = introductions[career].intro;
      
      console.log(`✅ Actualizado: ${career}`);
      console.log(`   Intro (ES): ${introductions[career].intro.es.substring(0, 80)}...`);
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    }
  }
  
  // Actualizar archivos de categorías
  for (const [category, filename] of Object.entries(categoryToFile)) {
    const filePath = path.join(__dirname, 'cursosFiles', filename);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (introductions[category]) {
      // Agregar campo intro al curso
      data.intro = introductions[category].intro;
      
      console.log(`✅ Actualizado: ${category}`);
      console.log(`   Intro (ES): ${introductions[category].intro.es.substring(0, 80)}...`);
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    }
  }
  
  console.log('\n📚 Archivos JSON actualizados exitosamente');
  console.log('\n🔄 Cargando datos a MongoDB...\n');
  
  // Conectar a MongoDB y actualizar
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const collection = db.collection('Cursos');
  
  let updated = 0;
  
  // Actualizar carreras
  for (const [career, filename] of Object.entries(careerToFile)) {
    const filePath = path.join(__dirname, 'cursosFiles', filename);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const result = await collection.updateOne(
      { id: data.id },
      { $set: { intro: data.intro } }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`✅ MongoDB actualizado: ${data.id}`);
      updated++;
    }
  }
  
  // Actualizar categorías
  for (const [category, filename] of Object.entries(categoryToFile)) {
    const filePath = path.join(__dirname, 'cursosFiles', filename);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const result = await collection.updateOne(
      { id: data.id },
      { $set: { intro: data.intro } }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`✅ MongoDB actualizado: ${data.id}`);
      updated++;
    }
  }
  
  console.log(`\n✅ Total de cursos actualizados en MongoDB: ${updated}`);
  
  await mongoose.disconnect();
  console.log('\n🔌 Conexión cerrada');
}

updateIntroductions().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
