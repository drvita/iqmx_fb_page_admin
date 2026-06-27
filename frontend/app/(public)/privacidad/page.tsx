import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Aviso de Privacidad - IQISS Insight",
  description: "Aviso de Privacidad de la plataforma IQISS Insight. Conoce cómo protegemos y tratamos tus datos de Facebook y métricas analíticas.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 relative z-10">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-accent tracking-wider uppercase bg-accent/10 border border-accent/20 px-3 py-1 rounded-full">
            Seguridad & Privacidad
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-main mt-4 mb-2">
            Aviso de Privacidad
          </h1>
          <p className="text-sm text-text-sub italic">
            Última actualización: 27 de junio de 2026
          </p>
        </div>
        <Link href="/" className="text-xs text-text-sub hover:text-text-main transition-colors font-medium border border-border-custom px-3 py-1.5 rounded-full bg-card-custom/50 w-fit">
          Volver al Inicio
        </Link>
      </div>


        <div className="space-y-8 text-text-main/90 leading-relaxed font-light">
          {/* Introducción */}
          <section className="card-feature border-accent/20 bg-card-custom/60 backdrop-blur-md">
            <p className="text-text-main">
              <strong>IQISS Insight</strong> (en adelante la &quot;Plataforma&quot;), un producto y marca registrada de <strong>IQISSMexico</strong>, está plenamente comprometido con proteger la privacidad y seguridad de los datos de nuestros usuarios. Este Aviso de Privacidad describe cómo recopilamos, usamos, almacenamos, procesamos y protegemos la información personal y las métricas de redes sociales que se gestionan dentro de la Plataforma.
            </p>
          </section>

          {/* Sección 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <span className="text-cta">1.</span> Información que Recopilamos
            </h2>
            <p className="text-text-sub text-sm">
              Para brindar nuestros servicios de analítica e inteligencia de negocio asistidos por IA, requerimos acceso a datos específicos a través de la integración oficial de <strong>Meta (Facebook)</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-4 rounded-xl bg-card-custom border border-border-custom">
                <h4 className="font-bold text-sm text-text-main mb-1">Datos de Cuenta y Perfil</h4>
                <p className="text-xs text-text-sub">
                  Nombre completo, dirección de correo electrónico e identificador único de usuario de Facebook (Facebook User ID) obtenidos mediante el inicio de sesión oficial.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-card-custom border border-border-custom">
                <h4 className="font-bold text-sm text-text-main mb-1">Datos de las Fanpages</h4>
                <p className="text-xs text-text-sub">
                  Tokens de acceso seguro, nombres, fotos de perfil e identificadores únicos de las páginas de Facebook comerciales que administras y decides vincular expresamente.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-card-custom border border-border-custom mt-2">
              <h4 className="font-bold text-sm text-text-main mb-1">Métricas de Rendimiento y Contenido</h4>
              <p className="text-xs text-text-sub">
                Estadísticas de tus páginas y publicaciones correspondientes al último ciclo de 28 días. Esto incluye número de seguidores, alcance general, engagement, así como la metadata pública de posts (fecha, texto, imágenes, número de reacciones, comentarios y veces compartido).
              </p>
            </div>
          </section>

          {/* Sección 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <span className="text-cta">2.</span> Uso y Finalidad de la Información
            </h2>
            <p className="text-text-sub text-sm">
              La recopilación y el tratamiento de los datos tienen la finalidad exclusiva de operar la Plataforma:
            </p>
            <ul className="list-disc list-inside text-text-sub text-sm space-y-1.5 ml-2">
              <li>Permitirte iniciar sesión de forma segura y asociar tus Fanpages comerciales.</li>
              <li>Sincronizar y almacenar en caché local los indicadores clave de rendimiento (KPIs) para visualizarlos de forma rápida y comprensible.</li>
              <li>Analizar el impacto y rendimiento de tus publicaciones del último ciclo de 28 días.</li>
              <li>Generar reportes semanales inteligentes con sugerencias personalizadas de optimización de contenido.</li>
            </ul>
          </section>

          {/* Sección 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <span className="text-cta">3.</span> Procesamiento con Inteligencia Artificial
            </h2>
            <p className="text-text-sub text-sm">
              IQISS Insight utiliza modelos avanzados de Inteligencia Artificial (IA) a través de la API de Google (Gemini) para proveer análisis predictivo y redactar las sugerencias de los reportes semanales.
            </p>
            <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 text-xs text-text-sub leading-relaxed">
              <span className="font-bold text-text-main block mb-1">Políticas de Procesamiento de IA:</span>
              Únicamente enviamos métricas de rendimiento agregadas y textos de tus publicaciones a los servicios de Inteligencia Artificial para generar las sugerencias. <strong>NO compartimos tus datos de identidad (nombre, correo electrónico, fotos ni ID de Facebook)</strong> con la API de IA. Los datos compartidos con la API de terceros no se utilizan para entrenar modelos públicos externos.
            </div>
          </section>

          {/* Sección 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <span className="text-cta">4.</span> Almacenamiento y Seguridad de Datos
            </h2>
            <p className="text-text-sub text-sm">
              Implementamos rigurosas medidas técnicas y organizativas para salvaguardar tu información frente a accesos no autorizados, pérdidas o alteraciones:
            </p>
            <ul className="list-disc list-inside text-text-sub text-sm space-y-1.5 ml-2">
              <li><strong>Consumo Interno en Servidor:</strong> El frontend de Next.js consume la API de forma interna en el servidor (SSR), evitando exponer llamadas de base de datos o claves en el navegador.</li>
              <li><strong>Encriptación:</strong> Los tokens de acceso de Facebook se almacenan encriptados en nuestra base de datos.</li>
              <li><strong>Red Privada:</strong> La base de datos PostgreSQL se hospeda en una red privada y aislada sin acceso directo desde el internet público.</li>
              <li><strong>No Exposición:</strong> Tus estadísticas y datos sincronizados son estrictamente privados y accesibles únicamente por ti tras iniciar sesión con tu perfil de Facebook.</li>
            </ul>
          </section>

          {/* Sección 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <span className="text-cta">5.</span> Compartición de Datos con Terceros
            </h2>
            <p className="text-text-sub text-sm">
              <strong>Bajo ninguna circunstancia vendemos o rentamos tu información personal</strong> con fines publicitarios o comerciales a terceros. La información solo se comparte de manera limitada con los siguientes proveedores esenciales:
            </p>
            <ul className="list-disc list-inside text-text-sub text-sm space-y-1.5 ml-2">
              <li><strong>Meta Platforms, Inc. (API de Facebook):</strong> Para el inicio de sesión y extracción oficial de tus analíticas autorizadas.</li>
              <li><strong>API de Inteligencia Artificial (Google Gemini):</strong> Para el procesamiento analítico y la redacción automatizada de los reportes.</li>
            </ul>
          </section>

          {/* Sección 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <span className="text-cta">6.</span> Consentimiento y Aceptación Tácita
            </h2>
            <p className="text-text-sub text-sm">
              Al utilizar la Plataforma e iniciar sesión a través del botón oficial de <strong>Facebook Login</strong>, usted otorga de forma expresa y tácita su consentimiento para que IQISS Insight procese sus datos de perfil público, tokens de acceso y métricas de rendimiento en los términos expuestos en este Aviso de Privacidad y en conformidad con los Términos y Condiciones de Servicio.
            </p>
          </section>

          {/* Sección 7 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <span className="text-cta">7.</span> Derechos ARCO y Eliminación de Cuenta
            </h2>
            <p className="text-text-sub text-sm">
              Conforme a la legislación mexicana (LFPDPPP), tienes derecho a <strong>Acceder, Rectificar, Cancelar u Oponerte</strong> al uso de tus datos personales. 
            </p>
            <p className="text-text-sub text-sm">
              Si deseas la baja definitiva de tu cuenta y la purga completa de tus datos de Facebook y métricas cacheadas en nuestro sistema, puedes consultar las instrucciones paso a paso en nuestra sección de <Link href="/eliminacion-cuenta" className="text-accent hover:underline font-semibold">Eliminación de Cuenta</Link> o enviar un correo electrónico directamente a <code className="bg-card-custom px-1.5 py-0.5 rounded border border-border-custom text-cta font-mono text-xs">chava.galindo.82@gmail.com</code>.
            </p>
          </section>

          {/* Sección 8 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <span className="text-cta">8.</span> Cambios a este Aviso de Privacidad
            </h2>
            <p className="text-text-sub text-sm">
              Nos reservamos el derecho de modificar o actualizar este aviso para reflejar cambios en la plataforma o por requerimientos legales de Meta o de las autoridades. Te sugerimos revisar periódicamente esta sección para mantenerte al tanto.
            </p>
          </section>
        </div>
    </main>
  );
}
