'use client'

export function LoginWhitGoogle() {

  const handleLogin = () => {
    const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
    const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL!);

    window.location.href = `https://${domain}/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
  };
  
return (<button type="button" className="google-login-button" onClick={handleLogin}>Login whit Google</button>);

}


