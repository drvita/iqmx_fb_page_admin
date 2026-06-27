import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Términos de Servicio - IQISS Insight",
  description: "Términos y Condiciones de Servicio de la plataforma IQISS Insight. Conoce las reglas y lineamientos de uso de nuestra plataforma.",
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 relative z-10">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-accent tracking-wider uppercase bg-accent/10 border border-accent/20 px-3 py-1 rounded-full">
            Legal & Acuerdos
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-main mt-4 mb-2">
            Términos y Condiciones de Servicio
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
          <section className="card-feature border-accent/20 bg-card-custom/60 backdrop-blur-md text-text-main">
            <p>
              Bienvenido a <strong>IQISS Insight</strong>. Los presentes Términos y Condiciones de Servicio (en adelante los &quot;Términos&quot;) rigen el uso de nuestra plataforma SaaS de analítica de redes sociales asistida por Inteligencia Artificial, provista por <strong>IQISSMexico</strong> (en adelante &quot;la Empresa&quot;, &quot;nosotros&quot; o &quot;nuestro&quot;). Al acceder a la plataforma o iniciar sesión mediante Facebook Login, usted acepta de manera expresa y vinculante estos Términos en su totalidad.
            </p>
          </section>

          {/* Sección 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <span className="text-cta">1.</span> Descripción del Servicio
            </h2>
            <p className="text-text-sub text-sm">
              IQISS Insight es una suite premium de business intelligence diseñada para extraer valor analítico y optimizar contenido en redes sociales. El servicio comprende:
            </p>
            <ul className="list-disc list-inside text-text-sub text-sm space-y-1.5 ml-2">
              <li><strong>Conexión con Facebook:</strong> Integración oficial a través de la Graph API de Meta para leer estadísticas agregadas de páginas administradas de manera autorizada.</li>
              <li><strong>Sincronización en Base de Datos:</strong> Almacenamiento local temporal de métricas analíticas clave (seguidores, alcance, interacciones) del ciclo de los últimos 28 días.</li>
              <li><strong>Auditoría de Publicaciones:</strong> Desglose y análisis detallado de posts específicos, contenidos y sus niveles de engagement individuales.</li>
              <li><strong>Reportes Semanales con IA:</strong> Generación automatizada de reportes consolidados y sugerencias de mejora de redacción y estrategia de contenido asistidos por Inteligencia Artificial.</li>
            </ul>
          </section>

          {/* Sección 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <span className="text-cta">2.</span> Aceptación Tácita y Acceso
            </h2>
            <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 text-xs text-text-sub leading-relaxed">
              <span className="font-bold text-text-main block mb-1">Aceptación mediante Autenticación:</span>
              El uso de la Plataforma e inicio de sesión a través del botón oficial de <strong>Facebook Login</strong> implica que usted reconoce haber leído, entendido y aceptado de manera expresa y tácita el Aviso de Privacidad y estos Términos y Condiciones de Servicio. Si usted no está de acuerdo con alguna de las cláusulas, no deberá hacer uso del sistema ni autenticarse en él.
            </div>
          </section>

          {/* Sección 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <span className="text-cta">3.</span> Esquema de Pago y Suscripciones
            </h2>
            <p className="text-text-sub text-sm">
              El servicio puede ofrecerse bajo modalidades gratuitas de prueba o suscripciones de pago recurrente:
            </p>
            <ul className="list-disc list-inside text-text-sub text-sm space-y-1.5 ml-2">
              <li><strong>Planes de Pago:</strong> Las cuotas de suscripción se detallarán de forma transparente en la plataforma o mediante contratos individuales específicos.</li>
              <li><strong>Pago Anticipado:</strong> Para planes de pago, la cuota correspondiente a cada mes de servicio debe cubrirse antes de su inicio. La falta de pago resultará en la suspensión inmediata del acceso a las funciones premium.</li>
              <li><strong>Sin Plazo Forzoso:</strong> Los planes no están sujetos a plazos forzosos. El usuario puede cancelar en cualquier momento y dejar de pagar el siguiente periodo para dar de baja la suscripción.</li>
            </ul>
          </section>

          {/* Sección 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <span className="text-cta">4.</span> Limitaciones de Uso e Inteligencia Artificial
            </h2>
            <p className="text-text-sub text-sm">
              Para garantizar la equidad en el consumo de recursos de computación y cumplir con nuestras políticas de calidad:
            </p>
            <div className="p-4 rounded-xl bg-card-custom border border-border-custom text-xs text-text-sub space-y-2">
              <p>
                🔒 <strong className="text-text-main">Límite de Reportes con IA:</strong> La generación de sugerencias y reportes automatizados mediante Inteligencia Artificial (IA) es una funcionalidad <strong>exclusiva para cuentas de pago</strong> y está estrictamente limitada a un máximo de <strong>1 reporte por semana</strong> por usuario.
              </p>
              <p>
                ⚙️ <strong className="text-text-main">Límites MVP:</strong> El número de páginas vinculadas simultáneamente y la cantidad de publicaciones sincronizadas están limitados a las cuotas técnicas de la fase actual de la Plataforma.
              </p>
            </div>
          </section>

          {/* Sección 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <span className="text-cta">5.</span> Garantía de Satisfacción y Reembolsos
            </h2>
            <p className="text-text-sub text-sm">
              Ofrecemos una garantía de satisfacción de <strong>30 días naturales</strong> a partir de la primera contratación de suscripción. Si por cualquier motivo no está conforme con los servicios durante este periodo, podrá solicitar el reembolso íntegro de su pago comunicándose con soporte. Transcurrido dicho periodo de 30 días, no se efectuarán reembolsos por periodos ya facturados.
            </p>
          </section>

          {/* Sección 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <span className="text-cta">6.</span> Disponibilidad y Limitación de Responsabilidad
            </h2>
            <p className="text-text-sub text-sm">
              IQISS Insight funciona en estrecha dependencia técnica de la infraestructura provista por Meta Platforms, Inc. (API de Facebook) y Google LLC (servicios de IA).
            </p>
            <ul className="list-disc list-inside text-text-sub text-sm space-y-1.5 ml-2">
              <li><strong>API de Terceros:</strong> No nos hacemos responsables por fallos, interrupciones o cambios repentinos en las políticas y estructuras de la API de Facebook o de Google que pudieran degradar temporal o permanentemente el funcionamiento de la Plataforma.</li>
              <li><strong>Métricas de Respaldo:</strong> Dada la depreciación constante de KPIs por parte de Meta, implementamos algoritmos de tolerancia a fallos y métricas de respaldo (fallbacks) para mitigar discrepancias, pero no garantizamos la absoluta disponibilidad de cada métrica si Meta la descontinúa.</li>
            </ul>
          </section>

          {/* Sección 7 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <span className="text-cta">7.</span> Propiedad Intelectual y Metadata
            </h2>
            <p className="text-text-sub text-sm">
              Todos los derechos sobre el software, diseño, marca, base de datos y lógica algorítmica de la Plataforma pertenecen de manera exclusiva a IQISSMexico. El usuario únicamente recibe una licencia limitada e intransferible de uso personal o empresarial durante su suscripción activa.
            </p>
            <p className="text-text-sub text-sm font-semibold">
              Asimismo, se establece expresamente que toda la metadata generada y compilada durante la prestación de los servicios analíticos y de reporte en la Plataforma es propiedad intelectual y comercial de IQISSMexico.
            </p>
          </section>

          {/* Sección 8 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <span className="text-cta">8.</span> Soporte Técnico
            </h2>
            <p className="text-text-sub text-sm">
              El canal oficial para soporte es el correo electrónico <code className="bg-card-custom px-1.5 py-0.5 rounded border border-border-custom text-cta font-mono text-xs">chava.galindo.82@gmail.com</code>. Las solicitudes de aclaración técnica o fallos serán atendidas en un horario habitual de oficina (lunes a viernes en días hábiles) en el menor tiempo posible según su criticidad.
            </p>
          </section>

          {/* Sección 9 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <span className="text-cta">9.</span> Jurisdicción y Legislación Aplicable
            </h2>
            <p className="text-text-sub text-sm">
              Estos Términos se rigen e interpretan bajo las leyes federales vigentes en los Estados Unidos Mexicanos. Para cualquier disputa judicial que surja relacionada con la interpretación o cumplimiento de estos acuerdos, las partes se someten voluntariamente a los tribunales competentes de los Estados Unidos Mexicanos, renunciando a cualquier otra jurisdicción por motivos de domicilio actual o futuro.
            </p>
          </section>
        </div>
    </main>
  );
}
