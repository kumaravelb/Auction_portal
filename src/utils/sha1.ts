/**
 * SHA-1 implementation that matches the JSP project's JavaScript implementation
 * This is the exact same code from login.jsp
 */

export class SHA1 {
  private static hexcase = 0; // hex output format. 0 - lowercase; 1 - uppercase

  /**
   * These are the functions you'll usually want to call
   * They take string arguments and return either hex or base-64 encoded strings
   */
  static hex_sha1(s: string): string {
    return SHA1.rstr2hex(SHA1.rstr_sha1(SHA1.str2rstr_utf8(s)));
  }

  /**
   * Calculate the SHA1 of a raw string
   */
  private static rstr_sha1(s: string): string {
    return SHA1.binb2rstr(SHA1.binb_sha1(SHA1.rstr2binb(s), s.length * 8));
  }

  /**
   * Convert a raw string to a hex string
   */
  private static rstr2hex(input: string): string {
    const hex_tab = SHA1.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    let output = "";
    for (let i = 0; i < input.length; i++) {
      const x = input.charCodeAt(i);
      output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F);
    }
    return output;
  }

  /**
   * Encode a string as utf-8.
   * For efficiency, this assumes the input is valid utf-16.
   */
  private static str2rstr_utf8(input: string): string {
    let output = "";
    let i = -1;

    while (++i < input.length) {
      /* Decode utf-16 surrogate pairs */
      let x = input.charCodeAt(i);
      const y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
      if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
        x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
        i++;
      }

      /* Encode output as utf-8 */
      if (x <= 0x7F)
        output += String.fromCharCode(x);
      else if (x <= 0x7FF)
        output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
      else if (x <= 0xFFFF)
        output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
      else if (x <= 0x1FFFFF)
        output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
    }
    return output;
  }

  /**
   * Convert a raw string to an array of big-endian words
   * Characters >255 have their high-byte silently ignored.
   */
  private static rstr2binb(input: string): number[] {
    const output = Array(input.length >> 2);
    for (let i = 0; i < output.length; i++)
      output[i] = 0;
    for (let i = 0; i < input.length * 8; i += 8)
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
    return output;
  }

  /**
   * Convert an array of big-endian words to a string
   */
  private static binb2rstr(input: number[]): string {
    let output = "";
    for (let i = 0; i < input.length * 32; i += 8)
      output += String.fromCharCode((input[i >> 5] >>> (24 - i % 32)) & 0xFF);
    return output;
  }

  /**
   * Calculate the SHA-1 of an array of big-endian words, and a bit length
   */
  private static binb_sha1(x: number[], len: number): number[] {
    /* append padding */
    x[len >> 5] |= 0x80 << (24 - len % 32);
    x[((len + 64 >> 9) << 4) + 15] = len;

    const w = Array(80);
    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;
    let e = -1009589776;

    for (let i = 0; i < x.length; i += 16) {
      const olda = a;
      const oldb = b;
      const oldc = c;
      const oldd = d;
      const olde = e;

      for (let j = 0; j < 80; j++) {
        if (j < 16)
          w[j] = x[i + j];
        else
          w[j] = SHA1.bit_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
        const t = SHA1.safe_add(SHA1.safe_add(SHA1.bit_rol(a, 5), SHA1.sha1_ft(j, b, c, d)),
          SHA1.safe_add(SHA1.safe_add(e, w[j]), SHA1.sha1_kt(j)));
        e = d;
        d = c;
        c = SHA1.bit_rol(b, 30);
        b = a;
        a = t;
      }

      a = SHA1.safe_add(a, olda);
      b = SHA1.safe_add(b, oldb);
      c = SHA1.safe_add(c, oldc);
      d = SHA1.safe_add(d, oldd);
      e = SHA1.safe_add(e, olde);
    }
    return [a, b, c, d, e];
  }

  /**
   * Perform the appropriate triplet combination function for the current
   * iteration
   */
  private static sha1_ft(t: number, b: number, c: number, d: number): number {
    if (t < 20)
      return (b & c) | ((~b) & d);
    if (t < 40)
      return b ^ c ^ d;
    if (t < 60)
      return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
  }

  /**
   * Determine the appropriate additive constant for the current iteration
   */
  private static sha1_kt(t: number): number {
    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
      (t < 60) ? -1894007588 : -899497514;
  }

  /**
   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
   * to work around bugs in some JS interpreters.
   */
  private static safe_add(x: number, y: number): number {
    const lsw = (x & 0xFFFF) + (y & 0xFFFF);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  /**
   * Bitwise rotate a 32-bit number to the left.
   */
  private static bit_rol(num: number, cnt: number): number {
    return (num << cnt) | (num >>> (32 - cnt));
  }
}