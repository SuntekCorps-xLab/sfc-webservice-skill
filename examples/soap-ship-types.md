# Example — SOAP getShipTypes

WSDL: `https://www.sendfromchina.com/ishipsvc/web-service?wsdl`

```php
<?php
header('content-type:text/html;charset=utf-8');
try {
    // Security: the WSDL advertises a plaintext soap:address
    // (http://api.sfcservice.com/ishipsvc/web-service). PHP SoapClient posts
    // every call to that address unless 'location' is set, which would send
    // appKey/token/userId unencrypted. Always pin the HTTPS location.
    $client = new SoapClient('https://www.sendfromchina.com/ishipsvc/web-service?wsdl', [
        'location' => 'https://www.sendfromchina.com/ishipsvc/web-service',
        'exceptions' => true,
    ]);
    $parameter = array(
        'HeaderRequest' => array(
            'appKey' => getenv('SFC_APP_KEY'),
            'token' => getenv('SFC_TOKEN'),
            'userId' => getenv('SFC_USER_ID'),
        ),
        // Use the division ID discovered by Step 2 in SKILL.md.
        'divisionId' => getenv('SFC_DIVISION_ID'),
    );
    $result = $client->getShipTypes($parameter);
    print_r($result);
} catch (SoapFault $e) {
    echo $e->getMessage();
}
```

Prefer HTTPS for new integrations when the same capability exists there. Use SOAP when you already depend on it or the needed method is SOAP-documented only.
