#pragma checksum "D:\Sources\Git\TabAjax\sample\TabAjax.WebApp\Views\Home\Index.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "1b0214862806cd37a4cff9fc3ccaa22d82024196"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(TabAjax.WebApp.Pages.Home.Views_Home_Index), @"mvc.1.0.view", @"/Views/Home/Index.cshtml")]
namespace TabAjax.WebApp.Pages.Home
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#nullable restore
#line 1 "D:\Sources\Git\TabAjax\sample\TabAjax.WebApp\Views\_ViewImports.cshtml"
using TabAjax.WebApp;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"1b0214862806cd37a4cff9fc3ccaa22d82024196", @"/Views/Home/Index.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"2e6d0f977d34ccb5a6cf8c95f7e746239143cf68", @"/Views/_ViewImports.cshtml")]
    public class Views_Home_Index : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
#nullable restore
#line 1 "D:\Sources\Git\TabAjax\sample\TabAjax.WebApp\Views\Home\Index.cshtml"
  
    ViewData["Title"] = "Home page";

#line default
#line hidden
#nullable disable
            WriteLiteral(@"
<div class=""text-center"">
    <p>Learn about <a href=""https://docs.microsoft.com/aspnet/core"">building Web apps with ASP.NET Core</a>.</p>
    <div>
        <h2>Display bloc</h2>
        <div class=""row"">
            <p>On ajoute deux attributs au bouton pour affichier un bloc dynamiquement : <code>tabajax-bloc=""#content""</code> &amp; <code>tabajax-url=""");
#nullable restore
#line 10 "D:\Sources\Git\TabAjax\sample\TabAjax.WebApp\Views\Home\Index.cshtml"
                                                                                                                                                  Write(Url.Action("Content", "Home"));

#line default
#line hidden
#nullable disable
            WriteLiteral("\"</code></p>            \r\n        </div>\r\n        <button tabajax-bloc=\"#content\"");
            BeginWriteAttribute("tabajax-url", " tabajax-url=\"", 519, "\"", 581, 1);
#nullable restore
#line 12 "D:\Sources\Git\TabAjax\sample\TabAjax.WebApp\Views\Home\Index.cshtml"
WriteAttributeValue("", 533, Url.Action("Content", "Home", new { type = 1 }), 533, 48, false);

#line default
#line hidden
#nullable disable
            EndWriteAttribute();
            WriteLiteral(" class=\"btn btn-primary\">Display Content 1</button>\r\n        <button tabajax-bloc=\"#content\"");
            BeginWriteAttribute("tabajax-url", " tabajax-url=\"", 674, "\"", 736, 1);
#nullable restore
#line 13 "D:\Sources\Git\TabAjax\sample\TabAjax.WebApp\Views\Home\Index.cshtml"
WriteAttributeValue("", 688, Url.Action("Content", "Home", new { type = 2 }), 688, 48, false);

#line default
#line hidden
#nullable disable
            EndWriteAttribute();
            WriteLiteral(" class=\"btn btn-primary\">Display Content 2</button>\r\n        <hr />\r\n        <div id=\"content\"></div>\r\n    </div>\r\n</div>");
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<dynamic> Html { get; private set; }
    }
}
#pragma warning restore 1591
