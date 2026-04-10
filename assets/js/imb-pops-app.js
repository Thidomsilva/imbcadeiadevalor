var setores=["Todos","Comercial","Financeiro","PCP","Engenharia","Compras","Industrial","Qualidade","Logística","Pós-Venda"];
var pops = window.IMB_POPS || [];
var curS = "Todos";

function getStatusLabel(status){
  return {cr:"Crítico",am:"Oportunidade",ok:"Estruturado"}[status] || "Em análise";
}

function getFilteredPops(){
  var q=document.getElementById("srch").value.toLowerCase();
  return pops.filter(function(p){
    var ms=curS==="Todos"||p.s===curS;
    var mq=!q||p.e.toLowerCase().includes(q)||p.s.toLowerCase().includes(q)||p.gT.toLowerCase().includes(q)||p.atv.toLowerCase().includes(q)||p.input.toLowerCase().includes(q);
    return ms&&mq;
  });
}

function buildOverview(list){
  var target=document.getElementById("overview");
  if(!target)return;
  target.innerHTML=list.map(function(p){
    return '<button class="ov-card" type="button" onclick="openStage(\'pop'+p.f+'\')">'+
      '<span class="ov-card-top">'+
        '<span class="ov-card-num">POP '+String(p.f).padStart(2,"0")+'</span>'+
        '<span class="ov-card-status '+p.st+'">'+getStatusLabel(p.st)+'</span>'+
      '</span>'+
      '<span class="ov-card-title">'+p.e+'</span>'+
      '<span class="ov-card-meta">'+p.s+' · '+p.sla+'</span>'+
      '<span class="ov-card-next">'+p.intg+'</span>'+
    '</button>';
  }).join("");
}

function buildF(){
  var h="";
  setores.forEach(function(s){
    var c=s===curS?"tb-btn on":"tb-btn";
    h+='<button class="'+c+'" onclick="setS(\''+s+'\')">'+s+'</button>';
  });
  document.getElementById("fbar").innerHTML=h;
}
function setS(s){curS=s;buildF();render();}

function render(){
  var list=getFilteredPops();
  document.getElementById("cnt").textContent="Exibindo "+list.length+" de "+pops.length+" POPs — clique em qualquer linha para expandir";
  var sBarC={cr:"sb-cr",am:"sb-am",ok:"sb-ok"};
  buildOverview(list);
  document.getElementById("lista").innerHTML=list.map(function(p){
    var id="pop"+p.f;
    var steps=p.passo.map(function(s,n){return"<li><strong>"+(n+1)+".</strong> "+s+"</li>";}).join("");
    var saidas=p.sai.map(function(s){return"<li>"+s+"</li>";}).join("");
    var crits=p.crit.map(function(s){return"<li>"+s+"</li>";}).join("");
    var atens=p.atencao.map(function(s){return"<li>"+s+"</li>";}).join("");
    return'<div class="pop-item" id="'+id+'">'+
      '<div class="pop-head" onclick="tog(\''+id+'\')">'+
        '<div class="ph-num"><span class="ph-num-inner">'+String(p.f).padStart(2,"0")+'</span></div>'+
        '<div class="ph-status"><div class="status-bar '+sBarC[p.st]+'"></div></div>'+
        '<div class="ph-setor"><span class="setor-pill '+p.sc+'">'+p.s+'</span></div>'+
        '<div class="ph-main"><span class="ph-etapa">'+p.e+'</span><span class="ph-input">'+p.input+'</span></div>'+
        '<div class="ph-sla"><span class="sla-val">SLA<br>'+p.sla+'</span></div>'+
        '<div class="ph-chev"><div class="chev-icon">&#9660;</div></div>'+
      '</div>'+
      '<div class="pop-body">'+
        '<div class="pb-iso-bar">'+
          '<div class="iso-field"><div class="iso-lbl">Responsável</div><div class="iso-val">'+p.resp+'</div></div>'+
          '<div class="iso-field"><div class="iso-lbl">Referência normativa</div><div class="iso-val">'+p.norma+'</div></div>'+
          '<div class="iso-field"><div class="iso-lbl">Input</div><div class="iso-val">'+p.input+'</div></div>'+
          '<div class="iso-field"><div class="iso-lbl">Output / Saída esperada</div><div class="iso-val">'+p.output+' → '+p.saida_esp+'</div></div>'+
        '</div>'+
        '<div class="pb-quick">'+
          '<div class="quick-card"><div class="quick-label">Status</div><div class="quick-value">'+getStatusLabel(p.st)+'</div></div>'+
          '<div class="quick-card"><div class="quick-label">Setor</div><div class="quick-value">'+p.s+'</div></div>'+
          '<div class="quick-card"><div class="quick-label">SLA</div><div class="quick-value">'+p.sla+'</div></div>'+
          '<div class="quick-card"><div class="quick-label">Próxima etapa</div><div class="quick-value">'+p.intg+'</div></div>'+
        '</div>'+
        '<div class="pb-gap">'+
          '<div class="gap-status-col"><span class="gap-badge '+p.gC+'"><span class="gap-dot '+p.gdC+'"></span>'+getStatusLabel(p.st)+'</span></div>'+
          '<div class="gap-content">'+
            '<div class="gap-title-txt">'+p.gL+'</div>'+
            '<div class="gap-desc-txt">'+p.gT+'</div>'+
            '<span class="gap-evid">'+p.ev+'</span>'+
          '</div>'+
        '</div>'+
        '<div class="pb-sections">'+
          '<div class="sec blue-sec"><div class="sec-head"><span class="sec-num">5.1</span><span class="sec-title">Atividade</span></div><div class="sec-body"><div class="sec-text">'+p.atv+'</div></div></div>'+
          '<div class="sec"><div class="sec-head"><span class="sec-num">5.2</span><span class="sec-title">Passo a passo operacional</span></div><div class="sec-body"><div class="sec-text"><ol>'+steps+'</ol></div></div></div>'+
          '<div class="pb-row2">'+
            '<div class="sec"><div class="sec-head"><span class="sec-num">5.3</span><span class="sec-title">Saídas esperadas</span></div><div class="sec-body"><div class="sec-text"><ul>'+saidas+'</ul></div></div></div>'+
            '<div class="sec"><div class="sec-head"><span class="sec-num">5.4</span><span class="sec-title">Critérios de avanço</span></div><div class="sec-body"><div class="sec-text"><ul>'+crits+'</ul></div></div></div>'+
          '</div>'+
          '<div class="pb-row2">'+
            '<div class="sec warn"><div class="sec-head"><span class="sec-num">5.5</span><span class="sec-title">Pontos de atenção</span></div><div class="sec-body"><div class="sec-text"><ul>'+atens+'</ul></div></div></div>'+
            '<div class="sec ok-sec"><div class="sec-head"><span class="sec-num">5.6</span><span class="sec-title">Ação imediata recomendada</span></div><div class="sec-body"><div class="sec-text">'+p.acao+'</div></div></div>'+
          '</div>'+
          '<div class="sec blue-sec"><div class="sec-head"><span class="sec-num">5.7</span><span class="sec-title">Integração com próxima etapa</span></div><div class="sec-body"><div class="sec-text">'+p.intg+'</div></div></div>'+
        '</div>'+
        '<div class="pb-actions">'+
          '<button class="act-btn" onclick="event.stopPropagation();sendPrompt(\'Crie o formulário/check-list operacional padrão ISO 9001 para o POP '+p.f+' — '+p.e+' da IMB Brasil\')"><span>Gerar formulário</span><span class="act-arr">↗</span></button>'+
          '<button class="act-btn" onclick="event.stopPropagation();sendPrompt(\'Como configurar e parametrizar o OMIE para suportar o POP '+p.f+' — '+p.e+' da IMB Brasil?\')"><span>Configurar no OMIE</span><span class="act-arr">↗</span></button>'+
          '<button class="act-btn primary" onclick="event.stopPropagation();sendPrompt(\'Elabore o plano de implementação prioritário para o POP '+p.f+' — '+p.e+' considerando o contexto atual da IMB Brasil\')"><span>Plano de implementação</span><span class="act-arr">↗</span></button>'+
        '</div>'+
      '</div>'+
    '</div>';
  }).join("");
}

function tog(id){
  var el=document.getElementById(id);
  if(el)el.classList.toggle("open");
}

function openStage(id){
  var el=document.getElementById(id);
  if(!el)return;
  if(!el.classList.contains("open"))el.classList.add("open");
  el.scrollIntoView({behavior:"smooth",block:"start"});
}

function getExportData(){
  return getFilteredPops().map(function(p){
    return {
      numero:p.f,
      setor:p.s,
      etapa:p.e,
      status:getStatusLabel(p.st),
      sla:p.sla,
      responsavel:p.resp,
      referencia_normativa:p.norma,
      input:p.input,
      atividade:p.atv,
      output:p.output,
      saida_esperada:p.saida_esp,
      lacuna:p.gL,
      descricao_lacuna:p.gT,
      evidencia:p.ev,
      passos:p.passo,
      saidas:p.sai,
      criterios:p.crit,
      pontos_atencao:p.atencao,
      acao_imediata:p.acao,
      integracao_proxima_etapa:p.intg
    };
  });
}

function downloadFile(filename, content, mimeType){
  var blob=new Blob([content],{type:mimeType});
  var url=URL.createObjectURL(blob);
  var link=document.createElement("a");
  link.href=url;
  link.download=filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportJson(){
  var data=getExportData();
  downloadFile("imb-pops-iso9001.json",JSON.stringify(data,null,2),"application/json;charset=utf-8");
}

function exportMarkdown(){
  var data=getExportData();
  var lines=[
    "# IMB Brasil - Fluxo POP ISO 9001",
    "",
    "Total exportado: "+data.length+" etapas",
    ""
  ];
  data.forEach(function(item){
    lines.push("## POP "+String(item.numero).padStart(2,"0")+" - "+item.etapa);
    lines.push("");
    lines.push("- Setor: "+item.setor);
    lines.push("- Status: "+item.status);
    lines.push("- SLA: "+item.sla);
    lines.push("- Responsável: "+item.responsavel);
    lines.push("- Referência normativa: "+item.referencia_normativa);
    lines.push("- Input: "+item.input);
    lines.push("- Output: "+item.output+" -> "+item.saida_esperada);
    lines.push("- Lacuna: "+item.lacuna);
    lines.push("- Próxima etapa: "+item.integracao_proxima_etapa);
    lines.push("");
    lines.push("### Atividade");
    lines.push(item.atividade);
    lines.push("");
    lines.push("### Evidência");
    lines.push(item.evidencia);
    lines.push("");
    lines.push("### Passos operacionais");
    item.passos.forEach(function(step,index){
      lines.push((index+1)+". "+step);
    });
    lines.push("");
    lines.push("### Saídas esperadas");
    item.saidas.forEach(function(value){
      lines.push("- "+value);
    });
    lines.push("");
    lines.push("### Critérios de avanço");
    item.criterios.forEach(function(value){
      lines.push("- "+value);
    });
    lines.push("");
    lines.push("### Pontos de atenção");
    item.pontos_atencao.forEach(function(value){
      lines.push("- "+value);
    });
    lines.push("");
    lines.push("### Ação imediata recomendada");
    lines.push(item.acao_imediata);
    lines.push("");
  });
  downloadFile("imb-pops-iso9001.md",lines.join("\n"),"text/markdown;charset=utf-8");
}

function exportPrint(){
  document.querySelectorAll(".pop-item").forEach(function(node){
    node.classList.add("open");
  });
  window.print();
}

document.getElementById("srch").addEventListener("input",render);
buildF();
render();
