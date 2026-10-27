import { useState } from "react";
import styled from "@emotion/styled";
import { Typography } from "../../src/components/Typography";
import { Card } from "../../src/components/Card";
import { Stack } from "../../src/components/Stack";
import { Textarea } from "../../src/components/Textarea";
import { Button } from "../../src/components/Button";
import { Divider } from "../../src/components/Divider";

const JwtContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const TokenInput = styled(Textarea)`
  font-family: 'Courier New', monospace;
  font-size: 13px;
  min-height: 200px;
`;

const JsonDisplay = styled.pre`
  background: #1e293b;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
`;

const ColoredSection = styled.span<{ color: string }>`
  color: ${props => props.color};
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 12px;
`;

const InfoBox = styled.div`
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
`;

interface DecodedToken {
  header: any;
  payload: any;
  signature: string;
  raw: {
    header: string;
    payload: string;
    signature: string;
  };
}

const sampleToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzA0NzI2MDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export function JwtDecoder() {
  const [token, setToken] = useState(sampleToken);
  const [decoded, setDecoded] = useState<DecodedToken | null>(null);
  const [error, setError] = useState<string | null>(null);

  const base64UrlDecode = (str: string): string => {
    try {
      // Replace URL-safe characters
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      // Pad with '=' to make length multiple of 4
      while (base64.length % 4) {
        base64 += '=';
      }
      // Decode base64
      const decoded = atob(base64);
      // Convert to UTF-8
      return decodeURIComponent(escape(decoded));
    } catch (e) {
      throw new Error('Invalid base64 encoding');
    }
  };

  const decodeToken = (jwtToken: string) => {
    try {
      setError(null);
      
      if (!jwtToken.trim()) {
        setDecoded(null);
        return;
      }

      const parts = jwtToken.split('.');
      
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. JWT must have 3 parts separated by dots.');
      }

      const [headerB64, payloadB64, signatureB64] = parts;

      const headerJson = base64UrlDecode(headerB64);
      const payloadJson = base64UrlDecode(payloadB64);

      const header = JSON.parse(headerJson);
      const payload = JSON.parse(payloadJson);

      setDecoded({
        header,
        payload,
        signature: signatureB64,
        raw: {
          header: headerB64,
          payload: payloadB64,
          signature: signatureB64
        }
      });
    } catch (e: any) {
      setError(e.message || 'Failed to decode JWT token');
      setDecoded(null);
    }
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newToken = e.target.value;
    setToken(newToken);
    decodeToken(newToken);
  };

  const handleClear = () => {
    setToken('');
    setDecoded(null);
    setError(null);
  };

  const handleUseSample = () => {
    setToken(sampleToken);
    decodeToken(sampleToken);
  };

  const formatJson = (obj: any): string => {
    return JSON.stringify(obj, null, 2);
  };

  const formatTimestamp = (timestamp: number): string => {
    try {
      const date = new Date(timestamp * 1000);
      return date.toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  // Decode on mount with sample token
  useState(() => {
    decodeToken(sampleToken);
  });

  return (
    <div>
      <Stack spacing={2}>
        <Typography variant="h4">JWT Decoder</Typography>
        <Typography variant="body1" color="textSecondary">
          Decode and inspect JSON Web Tokens (JWT). Paste your token below to see the decoded header and payload.
        </Typography>
      </Stack>

      <InfoBox>
        <strong>Note:</strong> This tool decodes tokens locally in your browser. No data is sent to any server.
      </InfoBox>

      <JwtContainer>
        <div>
          <Card elevation={2}>
            <Stack spacing={2}>
              <div>
                <Typography variant="h6" gutterBottom>
                  Encoded JWT
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Paste your JWT token here
                </Typography>
              </div>

              <TokenInput
                value={token}
                onChange={handleTokenChange}
                placeholder="Paste your JWT token here..."
                rows={10}
              />

              <Stack direction="row" spacing={2}>
                <Button variant="outlined" size="small" onClick={handleClear}>
                  Clear
                </Button>
                <Button variant="primary" size="small" onClick={handleUseSample}>
                  Use Sample Token
                </Button>
              </Stack>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              {decoded && (
                <div>
                  <Divider />
                  <Typography variant="caption" color="textSecondary">
                    Token Parts (Base64 URL encoded)
                  </Typography>
                  <Stack spacing={1} style={{ marginTop: 8 }}>
                    <div>
                      <ColoredSection color="#fb015b">Header:</ColoredSection>
                      <Typography variant="caption" style={{ wordBreak: 'break-all', display: 'block', marginTop: 4 }}>
                        {decoded.raw.header}
                      </Typography>
                    </div>
                    <div>
                      <ColoredSection color="#d63aff">Payload:</ColoredSection>
                      <Typography variant="caption" style={{ wordBreak: 'break-all', display: 'block', marginTop: 4 }}>
                        {decoded.raw.payload}
                      </Typography>
                    </div>
                    <div>
                      <ColoredSection color="#00b9f1">Signature:</ColoredSection>
                      <Typography variant="caption" style={{ wordBreak: 'break-all', display: 'block', marginTop: 4 }}>
                        {decoded.raw.signature}
                      </Typography>
                    </div>
                  </Stack>
                </div>
              )}
            </Stack>
          </Card>
        </div>

        <div>
          {decoded && (
            <Stack spacing={3}>
              <Card elevation={2}>
                <Stack spacing={2}>
                  <Typography variant="h6" style={{ color: '#fb015b' }}>
                    Header
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Algorithm & Token Type
                  </Typography>
                  <JsonDisplay>{formatJson(decoded.header)}</JsonDisplay>
                </Stack>
              </Card>

              <Card elevation={2}>
                <Stack spacing={2}>
                  <Typography variant="h6" style={{ color: '#d63aff' }}>
                    Payload
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Data & Claims
                  </Typography>
                  <JsonDisplay>{formatJson(decoded.payload)}</JsonDisplay>

                  {(decoded.payload.iat || decoded.payload.exp || decoded.payload.nbf) && (
                    <>
                      <Divider />
                      <div>
                        <Typography variant="subtitle2" gutterBottom>
                          Timestamps
                        </Typography>
                        <Stack spacing={1}>
                          {decoded.payload.iat && (
                            <Typography variant="body2">
                              <strong>Issued At (iat):</strong> {formatTimestamp(decoded.payload.iat)}
                            </Typography>
                          )}
                          {decoded.payload.exp && (
                            <Typography variant="body2">
                              <strong>Expires At (exp):</strong> {formatTimestamp(decoded.payload.exp)}
                              {decoded.payload.exp * 1000 < Date.now() && (
                                <span style={{ color: '#c33', marginLeft: 8 }}>
                                  (Expired)
                                </span>
                              )}
                              {decoded.payload.exp * 1000 >= Date.now() && (
                                <span style={{ color: '#0a0', marginLeft: 8 }}>
                                  (Valid)
                                </span>
                              )}
                            </Typography>
                          )}
                          {decoded.payload.nbf && (
                            <Typography variant="body2">
                              <strong>Not Before (nbf):</strong> {formatTimestamp(decoded.payload.nbf)}
                            </Typography>
                          )}
                        </Stack>
                      </div>
                    </>
                  )}
                </Stack>
              </Card>

              <Card elevation={2}>
                <Stack spacing={2}>
                  <Typography variant="h6" style={{ color: '#00b9f1' }}>
                    Signature
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Verify Signature (Base64 URL encoded)
                  </Typography>
                  <JsonDisplay>{decoded.signature}</JsonDisplay>
                  <InfoBox style={{ margin: 0 }}>
                    The signature is used to verify that the sender of the JWT is who it says it is and to ensure that the message wasn't changed along the way.
                  </InfoBox>
                </Stack>
              </Card>
            </Stack>
          )}

          {!decoded && !error && (
            <Card elevation={2}>
              <Stack spacing={2} alignItems="center" style={{ padding: '40px 20px', textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">
                  No Token to Decode
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Paste a JWT token in the input field to see the decoded content
                </Typography>
              </Stack>
            </Card>
          )}
        </div>
      </JwtContainer>
    </div>
  );
}
