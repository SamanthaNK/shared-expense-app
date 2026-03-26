import { Modal, View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRef, useState } from 'react';
import { colors, fonts, radius } from '../constants/theme';

const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

function buildCaptchaHtml(siteKey) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #F7F3EE;
      font-family: sans-serif;
    }
    .wrap { padding: 24px; text-align: center; }
    p { margin-bottom: 16px; color: #8A7A72; font-size: 15px; }
  </style>
</head>
<body>
  <div class="wrap">
    <p>Please complete the security check</p>
    <div class="g-recaptcha"
         data-sitekey="${siteKey}"
         data-callback="onCaptchaSuccess"
         data-expired-callback="onCaptchaExpired">
    </div>
  </div>

  <script>
    function onCaptchaSuccess(token) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS', token }));
    }

    function onCaptchaExpired() {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'EXPIRED' }));
    }
  </script>

  <script src="https://www.google.com/recaptcha/api.js" async defer></script>
</body>
</html>
`;
}

export default function CaptchaModal({ visible, onVerify, onCancel }) {
    const webViewRef = useRef(null);
    const [loading, setLoading] = useState(true);

    const handleMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.type === 'SUCCESS' && data.token) {
                onVerify(data.token);
            } else if (data.type === 'EXPIRED') {
                webViewRef.current?.reload();
            }
        } catch { }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Security Check</Text>
                        <TouchableOpacity onPress={onCancel} style={styles.closeBtn}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* reCAPTCHA WebView */}
                    <View style={styles.webViewWrap}>
                        {loading && (
                            <ActivityIndicator
                                style={StyleSheet.absoluteFill}
                                size="large"
                                color={colors.accent}
                            />
                        )}
                        <WebView
                            ref={webViewRef}
                            originWhitelist={['*']}
                            source={{
                                html: buildCaptchaHtml(RECAPTCHA_SITE_KEY),
                                baseUrl: 'http://10.0.2.2:8080'
                            }}
                            onMessage={handleMessage}
                            onLoadEnd={() => setLoading(false)}
                            javaScriptEnabled
                            domStorageEnabled
                            style={{ flex: 1, backgroundColor: 'transparent' }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(44,36,32,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    sheet: {
        width: '100%',
        backgroundColor: colors.paper,
        borderRadius: radius.xl,
        overflow: 'hidden',
        maxHeight: 380,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        fontFamily: fonts.bold,
        fontSize: 20,
        color: colors.ink,
    },
    closeBtn: {
        padding: 4,
    },
    closeText: {
        fontSize: 16,
        color: colors.inkMid,
    },
    webViewWrap: {
        height: 280,
    },
});