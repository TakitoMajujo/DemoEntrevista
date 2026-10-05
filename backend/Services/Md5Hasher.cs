using System.Security.Cryptography;
using System.Text;

namespace DemoEntrevista.Api.Services;

public static class Md5Hasher
{
    public static string Hash(string value)
    {
        var bytes = MD5.HashData(Encoding.UTF8.GetBytes(value));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }
}
