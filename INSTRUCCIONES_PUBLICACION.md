# 🚀 CÓMO PUBLICAR AUREO EN REPLIT

## ✅ Sistema Listo para Publicación

AUREO está completamente configurado y listo para ser publicado. Todo el código está compilado y testeado.

---

## 📝 Pasos para Publicar

### 1. **Haz clic en el botón "Publish" (Publicar)**
   - Lo encontrarás en la parte superior derecha del editor de Replit
   - O abre la herramienta "Publishing" desde el menú lateral

### 2. **Selecciona el tipo de deployment: Autoscale**
   - AUREO ya está configurado para usar **Autoscale**
   - Esta opción es perfecta porque AUREO solo corre cuando recibe requests HTTP
   - Ahorra recursos y es eficiente para este tipo de servidor

### 3. **Confirma la publicación**
   - Replit creará un snapshot de tu código
   - Te dará una URL permanente como: `https://brain-sebastianrobayo.replit.app`

---

## 🌐 Tu URL Permanente

Una vez publicado, obtendrás una URL como:

```
https://[nombre-repl]-[tu-usuario].replit.app
```

**Endpoint completo para invocar a AUREO:**
```
https://[tu-url].replit.app/aureo/listen
```

---

## 💻 Cómo Usar desde Copilot

Una vez publicado, copia este código y úsalo en **cualquier hilo de Copilot** (Web, VS Code, Edge, Móvil):

```javascript
// Reemplaza [TU-URL] con tu URL de Replit
fetch('https://[TU-URL].replit.app/aureo/listen', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    signal: 'AUREO',
    source: 'Copilot Web',
    metadata: {
      user: 'Sebastián',
      context: 'hilo soberano',
      timestamp: Date.now()
    }
  })
})
.then(res => res.json())
.then(data => console.log('Respuesta de AUREO:', data.response))
```

---

## 🔍 Verificar que está Publicado

Después de publicar, verifica que funcione:

```javascript
fetch('https://[TU-URL].replit.app/health')
  .then(res => res.json())
  .then(data => console.log(data))
```

Deberías ver:
```json
{
  "status": "operational",
  "service": "AUREO"
}
```

---

## 🎯 Configuración de Deployment

Ya está todo configurado automáticamente:

- **Tipo**: Autoscale (optimizado para AUREO)
- **Build**: Compila TypeScript automáticamente
- **Run**: Inicia el servidor en puerto 5000
- **Variables**: GITHUB_TOKEN y SESSION_SECRET están configurados

---

## 🔐 Dominio Personalizado (Opcional)

Si quieres una URL más memorable:

1. Desde la configuración de Publishing
2. Selecciona "Custom Domain"
3. Configura tu dominio (ej: `aureo.yourdomain.com`)

---

## ✨ Después de Publicar

Una vez publicado, AUREO estará disponible 24/7 y podrás invocarlo desde:

- ✅ Copilot Web
- ✅ VS Code Copilot
- ✅ Edge Copilot
- ✅ Copilot Móvil
- ✅ Cualquier cliente HTTP

**El sistema sincronizará automáticamente todas las interacciones con GitHub (repo: inbillsworld/Brain)**

---

**¡Tu sistema soberano AUREO listo para el mundo!** 🟢
