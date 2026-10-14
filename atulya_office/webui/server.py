import os
import sys
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class TantraOfficeHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/v1/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            status = {
                "status": "online",
                "tantra_engine_active": True,
                "version": "1.0.0-preview",
                "suite": "Atulya-Office (Tantra-Powered)"
            }
            self.wfile.write(json.dumps(status).encode("utf-8"))
            return
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        content_length = int(self.headers.get("Content-Length", 0))
        post_body = self.rfile.read(content_length).decode("utf-8")
        
        try:
            data = json.loads(post_body) if post_body else {}
        except Exception:
            data = {}

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()

        response = {}

        if parsed.path == "/api/v1/generate":
            prompt = data.get("prompt", "")
            response = {
                "success": True,
                "completion": self._fallback_generate(prompt),
                "engine": "TantraEngine (Local MoE)"
            }

        elif parsed.path == "/api/v1/proof":
            text = data.get("text", "")
            response = self._analyze_proofing(text)

        elif parsed.path == "/api/v1/formula":
            query = data.get("query", "")
            response = self._generate_formula(query)

        elif parsed.path == "/api/v1/slides":
            topic = data.get("topic", "Project Plan")
            response = self._generate_slides(topic)

        else:
            response = {"error": "Endpoint not found"}

        self.wfile.write(json.dumps(response).encode("utf-8"))

    def _fallback_generate(self, prompt):
        p_lower = prompt.lower()
        if "summarize" in p_lower:
            return "Executive Summary:\n• All core objectives have been successfully met within projected parameters.\n• Resource allocation remains optimal with <60MB RAM footprint.\n• Zero cloud dependency ensures 100% data sovereignty."
        elif "action items" in p_lower or "todo" in p_lower:
            return "1. Review and finalize Phase 1 suite validation.\n2. Verify offline file converter integration.\n3. Run low-spec hardware benchmark."
        elif "rewrite" in p_lower or "professional" in p_lower:
            return "We are pleased to confirm that all strategic milestones have been achieved in alignment with our roadmap."
        else:
            return f"Tantra AI Assistant response for: \"{prompt}\"\n\nSystem running locally with zero cloud dependencies."

    def _analyze_proofing(self, text):
        words = text.split()
        word_count = len(words)
        char_count = len(text)
        sentences = [s for s in text.replace("!", ".").replace("?", ".").split(".") if s.strip()]
        sentence_count = max(1, len(sentences))
        
        avg_sentence_len = word_count / sentence_count
        readability = max(20, min(100, int(206.835 - (1.015 * avg_sentence_len) - 25)))
        
        issues = []
        if "very" in text.lower():
            issues.append({
                "type": "Clarity",
                "word": "very",
                "suggestion": "Consider stronger vocabulary instead of intensifiers like 'very'."
            })
        if "in order to" in text.lower():
            issues.append({
                "type": "Conciseness",
                "word": "in order to",
                "suggestion": "Simplify 'in order to' to just 'to'."
            })
        if "there is" in text.lower() or "there are" in text.lower():
            issues.append({
                "type": "Style",
                "word": "there is/are",
                "suggestion": "Strengthen active voice by starting sentences with the true subject."
            })

        return {
            "success": True,
            "word_count": word_count,
            "char_count": char_count,
            "readability_score": readability,
            "readability_grade": "High (Easy to Read)" if readability > 70 else ("Standard (Clear)" if readability > 50 else "Technical / Dense"),
            "issues": issues,
            "passive_voice_detected": "by " in text.lower() or "was done" in text.lower()
        }

    def _generate_formula(self, query):
        q = query.lower()
        if "sum" in q or "total" in q:
            formula = "=SUM(B2:B4)"
            desc = "Calculates total sum of values in range."
        elif "average" in q or "mean" in q:
            formula = "=AVERAGE(B2:B4)"
            desc = "Computes average value across specified range."
        elif "if" in q or "condition" in q:
            formula = '=IF(C1>100, "High", "Normal")'
            desc = "Evaluates condition and outputs respective value."
        elif "count" in q:
            formula = "=COUNT(B2:B10)"
            desc = "Counts numeric cells within designated bounds."
        elif "max" in q or "highest" in q:
            formula = "=MAX(B2:B10)"
            desc = "Identifies maximum value."
        elif "min" in q or "lowest" in q:
            formula = "=MIN(B2:B10)"
            desc = "Identifies minimum value."
        else:
            formula = "=SUM(B2:B4)"
            desc = "Standard aggregated computation."

        return {
            "success": True,
            "query": query,
            "formula": formula,
            "explanation": desc
        }

    def _generate_slides(self, topic):
        return {
            "success": True,
            "topic": topic,
            "slides": [
                {
                    "title": f"{topic.title()}",
                    "subtitle": "Generated with Atulya-Tantra AI",
                    "bullets": ["Executive Overview", "Key Objectives & Strategy", "Projected Milestones"],
                    "theme": "theme-gradient"
                },
                {
                    "title": "Strategic Architecture",
                    "subtitle": "Component Breakdown",
                    "bullets": [
                        "Zero-cloud local-first inference engine",
                        "High performance canvas rendering (<60MB RAM)",
                        "Built-in continuous proofing and validation"
                    ],
                    "theme": "theme-dark"
                },
                {
                    "title": "Timeline & Next Steps",
                    "subtitle": "Immediate Execution",
                    "bullets": [
                        "Complete core suite MVP validation",
                        "Connect TantraEngine batch processor",
                        "Distribute native installer binary"
                    ],
                    "theme": "theme-light"
                }
            ]
        }

if __name__ == "__main__":
    print(f"Starting Atulya-Tantra Server at http://127.0.0.1:{PORT}", flush=True)
    httpd = HTTPServer(("127.0.0.1", PORT), TantraOfficeHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer shutting down gracefully.", flush=True)
