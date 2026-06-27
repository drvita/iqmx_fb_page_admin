import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Eliminación de Cuenta - IQISS Insight",
  description: "Instrucciones detalladas sobre cómo solicitar la eliminación definitiva de tu cuenta y datos en la plataforma IQISS Insight.",
};

export default function DataDeletionPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 relative z-10">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-accent tracking-wider uppercase bg-accent/10 border border-accent/20 px-3 py-1 rounded-full">
            Soporte & Privacidad
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-main mt-4 mb-2">
            Eliminación de Cuenta y Datos
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
              En <strong>IQISS Insight</strong> valoramos su privacidad y le brindamos el control absoluto sobre sus datos personales. De conformidad con las políticas de Meta (Facebook) y el Aviso de Privacidad de la Empresa, a continuación se detalla el proceso oficial y exclusivo para solicitar la baja definitiva de su cuenta de usuario y la depuración de sus datos.
            </p>
          </section>

          {/* Proceso de Solicitud */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <span className="text-cta">1.</span> Proceso de Solicitud de Eliminación (100% Digital)
            </h2>
            <p className="text-text-sub text-sm">
              Todo el trámite se realiza exclusivamente por correo electrónico para garantizar la seguridad y validación de la identidad del solicitante:
            </p>

            <div className="space-y-4 ml-2">
              {/* Paso 1 */}
              <div className="border-l-4 border-cta pl-4 py-2">
                <h3 className="text-sm font-bold text-text-main">Paso 1: Solicitud inicial por Email</h3>
                <p className="text-xs text-text-sub mt-1">
                  Envíe un correo electrónico formal a nuestra dirección de soporte oficial:
                </p>
                <div className="my-2 text-cta font-mono text-sm bg-card-custom px-3 py-2 rounded-lg border border-border-custom inline-block">
                  chava.galindo.82@gmail.com
                </div>
                <div className="text-xs text-text-sub space-y-1">
                  <p><strong>El correo debe especificar obligatoriamente:</strong></p>
                  <ul className="list-disc list-inside ml-2">
                    <li>Que el trámite es para la plataforma <span className="font-semibold text-text-main">IQISS Insight</span>.</li>
                    <li>La dirección de correo electrónico vinculada a su cuenta de IQISS Insight.</li>
                    <li>El identificador único de usuario de Facebook (Facebook User ID) asociado a su inicio de sesión, o su nombre de perfil de Facebook vinculador.</li>
                  </ul>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="border-l-4 border-cta pl-4 py-2">
                <h3 className="text-sm font-bold text-text-main">Paso 2: Procesamiento y Tiempos</h3>
                <p className="text-xs text-text-sub mt-1">
                  Una vez que recibimos su correo electrónico y validamos que los datos coinciden con su registro, nuestro equipo de TI iniciará el proceso de baja en el sistema. La remoción total de registros de bases de datos y la revocación de tokens tarda un tiempo estimado de <strong>1 a 72 horas hábiles</strong>.
                </p>
              </div>

              {/* Paso 3 */}
              <div className="border-l-4 border-cta pl-4 py-2">
                <h3 className="text-sm font-bold text-text-main">Paso 3: Notificación de Término</h3>
                <p className="text-xs text-text-sub mt-1">
                  Una vez finalizado el proceso de purga y desvinculación, <strong>se le enviará una notificación por correo electrónico</strong> confirmando que los datos han sido borrados de forma irreversible de todos nuestros sistemas.
                </p>
              </div>
            </div>
          </section>

          {/* Datos Eliminados y Retenidos */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <span className="text-cta">2.</span> Destino de los Datos (Borrado vs. Retención)
            </h2>
            <p className="text-text-sub text-sm">
              Al completarse la eliminación de la cuenta de IQISS Insight, el sistema ejecutará las siguientes acciones en nuestros servidores:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-card-custom border border-border-custom">
                <h4 className="font-bold text-sm text-text-main mb-1 text-red-500">❌ Datos Eliminados permanentemente:</h4>
                <ul className="list-disc list-inside text-xs text-text-sub space-y-1 ml-1">
                  <li>Tu perfil de usuario (nombre, ID de Facebook, correo electrónico).</li>
                  <li>Tokens de acceso seguro de las páginas comerciales asociadas.</li>
                  <li>Cachés locales de métricas de rendimiento descargadas de Facebook (Alcance, Seguidores, Engagement).</li>
                  <li>Historial de posts y estadísticas de engagement cacheadas.</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-card-custom border border-border-custom">
                <h4 className="font-bold text-sm text-text-main mb-1 text-accent">🛡️ Datos Retenidos de forma disasociada:</h4>
                <p className="text-xs text-text-sub">
                  Toda la metadata técnica de uso del servicio generada durante la vigencia del mismo (por ejemplo, recuentos agregados de reportes generados o logs de actividad de servidores) es propiedad de la Empresa y no será objeto de borrado, dado que no contiene ninguna información identificable ni referencias a su perfil personal o de sus Fanpages.
                </p>
              </div>
            </div>
          </section>

          {/* Enlaces legales adicionales */}
          <section className="pt-6 border-t border-border-custom text-center md:text-left space-y-2">
            <p className="text-text-sub text-xs">
              Para obtener más detalles sobre el tratamiento técnico de su información, puede consultar nuestro <Link href="/privacidad" className="text-accent hover:underline font-semibold">Aviso de Privacidad</Link> o revisar nuestros <Link href="/terminos" className="text-accent hover:underline font-semibold">Términos de Servicio</Link>.
            </p>
          </section>
        </div>
    </main>
  );
}
