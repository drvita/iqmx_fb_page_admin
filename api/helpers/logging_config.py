import logging
import re
import traceback

class SensitiveDataFilter(logging.Filter):
    """
    Logging filter that sanitizes sensitive information (like access tokens, client secrets, JWTs)
    from log messages, arguments, and exception stack traces.
    """
    def __init__(self, name: str = ""):
        super().__init__(name)
        # Regex to match key=value query string parameter format
        # Matches: access_token=EAAC... or access_token%3DEAAC...
        self.query_pattern = re.compile(
            r'(?i)(access_token|client_secret|fb_exchange_token|session_token|fb_access_token|page_access_token|token)(?:=|%3D)([^&\s\'"\/]+)'
        )
        
        # Regex to match JSON/dictionary key-value format
        # Matches: "access_token": "EAAC..." or 'access_token': 'EAAC...'
        self.json_pattern = re.compile(
            r'(?i)(["\']?(?:access_token|client_secret|fb_exchange_token|session_token|fb_access_token|page_access_token|token)["\']?\s*[:=]\s*["\'])([^"\'\s]+)(["\'])'
        )
        
        # Regex to match JWT tokens starting with eyJ
        self.jwt_pattern = re.compile(
            r'\beyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\b'
        )
        
        # Regex to match raw Facebook Graph API tokens starting with EAA (minimum 30 chars to avoid false positives)
        self.fb_token_pattern = re.compile(
            r'\bEAA[a-zA-Z0-9]{30,}\b'
        )

    def sanitize(self, text: str) -> str:
        if not text:
            return text
        
        # 1. Mask JWT tokens
        text = self.jwt_pattern.sub("[JWT_MASKED]", text)
        
        # 2. Mask raw Facebook access tokens
        text = self.fb_token_pattern.sub("[FB_TOKEN_MASKED]", text)
        
        # 3. Mask JSON/dict credentials
        text = self.json_pattern.sub(r"\1[MASKED]\3", text)
        
        # 4. Mask query parameter credentials
        text = self.query_pattern.sub(r"\1=[MASKED]", text)
        
        return text

    def filter(self, record: logging.LogRecord) -> bool:
        # Sanitize msg
        if isinstance(record.msg, str):
            record.msg = self.sanitize(record.msg)
            
        # Sanitize arguments
        if record.args:
            if isinstance(record.args, dict):
                record.args = {
                    k: (self.sanitize(v) if isinstance(v, str) else v)
                    for k, v in record.args.items()
                }
            else:
                record.args = tuple(
                    self.sanitize(arg) if isinstance(arg, str) else arg
                    for arg in record.args
                )
                
        # Sanitize tracebacks (exc_info)
        if record.exc_info:
            exc_text = "".join(traceback.format_exception(*record.exc_info))
            record.exc_text = self.sanitize(exc_text)
            # Remove exc_info so default formatter uses pre-sanitized exc_text
            record.exc_info = None
            
        # Sanitize already formatted exc_text
        if record.exc_text:
            record.exc_text = self.sanitize(record.exc_text)
            
        return True

def setup_logging_sanitization():
    """
    Applies the SensitiveDataFilter to all handlers of the root logger,
    ensuring that any log message going through the system is sanitized.
    Also configures Uvicorn and FastAPI default loggers if they exist.
    """
    sensitive_filter = SensitiveDataFilter()
    
    # 1. Get and configure root logger
    root_logger = logging.getLogger()
    if not any(isinstance(f, SensitiveDataFilter) for f in root_logger.filters):
        root_logger.addFilter(sensitive_filter)
        
    for handler in root_logger.handlers:
        if not any(isinstance(f, SensitiveDataFilter) for f in handler.filters):
            handler.addFilter(sensitive_filter)
            
    # 2. Attach specifically to key application and framework loggers
    loggers_to_protect = [
        "uvicorn",
        "uvicorn.error",
        "uvicorn.access",
        "fastapi",
        "fb_page_admin_api.facebook_helper",
        "fb_page_admin_api.helpers.sync",
        "fb_page_admin_api.routes.auth",
        "fb_page_admin_api.routes.pages",
        "iqiss_insight_sync_command",
        "iqiss_insight_db_seeder"
    ]
    
    for logger_name in loggers_to_protect:
        l = logging.getLogger(logger_name)
        if not any(isinstance(f, SensitiveDataFilter) for f in l.filters):
            l.addFilter(sensitive_filter)
        for handler in l.handlers:
            if not any(isinstance(f, SensitiveDataFilter) for f in handler.filters):
                handler.addFilter(sensitive_filter)
