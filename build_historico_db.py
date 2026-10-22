import csv
import json
import re
import pymupdf

def load_centros_catalog():
    centros_map = {}
    catalog_path = 'C:/Users/herri/Desktop/destinos/data/centros_cv.csv'
    try:
        with open(catalog_path, encoding='utf-8', errors='ignore') as f:
            reader = csv.DictReader(f, delimiter=';')
            for row in reader:
                cod = row.get('codigo', '').strip('"')
                denom = row.get('denominacion_especifica', '').strip('"') or row.get('denominacion', '').strip('"')
                loc = row.get('localidad', '').strip('"')
                prov = row.get('provincia', '').strip('"').split('/')[0].strip().title()
                comarca = row.get('comarca', '').strip('"')
                centros_map[cod] = {
                    'nombre': denom,
                    'municipio': loc,
                    'provincia': prov,
                    'comarca': comarca
                }
    except Exception as e:
        print(f"Warning: could not load centros catalog: {e}")
    return centros_map

def clean_spec_name(raw, cuerpo):
    # Strip non-ascii characters to make matching 100% resilient
    ascii_clean = raw.encode('ascii', 'ignore').decode('ascii').upper()
    
    # Maestros
    if 'INFANTIL' in ascii_clean:
        return 'Educaci\u00f3n Infantil'
    if 'PRIMRIA' in ascii_clean or 'PRIMARIA' in ascii_clean:
        if 'FPA' in ascii_clean:
            return 'FPA Primaria'
        if cuerpo == 'Maestros' or 'MESTRES' in ascii_clean:
            return 'Educaci\u00f3n Primaria'
    if cuerpo == 'Maestros':
        if 'ANGLS' in ascii_clean or 'INGLS' in ascii_clean:
            return 'Ingl\u00e9s (Maestros)'
        if 'FRANCS' in ascii_clean:
            return 'Franc\u00e9s (Maestros)'
        if 'FSICA' in ascii_clean or 'FISICA' in ascii_clean:
            return 'Educaci\u00f3n F\u00edsica (Maestros)'
        if 'MSICA' in ascii_clean or 'MUSICA' in ascii_clean:
            return 'M\u00fasica (Maestros)'
        if 'AUDICI' in ascii_clean or 'AUDICIN' in ascii_clean:
            return 'Audici\u00f3n y Lenguaje (AL)'
        if 'PEDAGOG' in ascii_clean:
            if 'ESPECIAL' in ascii_clean:
                return 'EE: Pedagog\u00eda Terap\u00e9utica'
            return 'Pedagog\u00eda Terap\u00e9utica (PT)'
            
    # Secundaria / FP / Otros
    if 'ADMINISTRACI' in ascii_clean or 'EMPRESAS' in ascii_clean:
        if 'GESTI' in ascii_clean:
            return 'Procesos de Gesti\u00f3n Administrativa'
        return 'Administraci\u00f3n de Empresas'
    if 'ALEMN' in ascii_clean or 'ALEMANY' in ascii_clean:
        return 'Alem\u00e1n'
    if 'CIENTIFIC' in ascii_clean or 'CINTIFICO' in ascii_clean:
        if 'FPA' in ascii_clean:
            return 'FPA Cient\u00edfico/Tecnol\u00f3gico'
        return '\u00c1mbito Cient\u00edfico'
    if 'ANGLS' in ascii_clean or 'INGLS' in ascii_clean:
        if 'FPA' in ascii_clean:
            return 'FPA Ingl\u00e9s'
        return 'Ingl\u00e9s (Secundaria)'
    if 'QUMICA INDUSTRIAL' in ascii_clean or 'QUIMICA INDUSTRIAL' in ascii_clean:
        return 'An\u00e1lisis y Qu\u00edmica Industrial'
    if 'ARPA' in ascii_clean:
        return 'Arpa'
    if 'IMATGE PERSONAL' in ascii_clean or 'IMAGEN PERSONAL' in ascii_clean:
        return 'Asesor\u00eda y Procesos de Imagen Personal'
    if 'BIOLOG' in ascii_clean:
        return 'Biolog\u00eda y Geolog\u00eda'
    if 'CORO' in ascii_clean or 'COR' in ascii_clean:
        return 'Coro'
    if 'CUINA' in ascii_clean or 'COCINA' in ascii_clean:
        return 'Cocina y Pasteler\u00eda'
    if 'CLSSICA' in ascii_clean or 'CLSICA' in ascii_clean:
        if 'DANSA' in ascii_clean or 'DANZA' in ascii_clean:
            return 'Danza Cl\u00e1sica'
        return 'Cultura Cl\u00e1sica'
    if 'DIBUIX' in ascii_clean or 'DIBUJO' in ascii_clean:
        if 'ARTSTIC' in ascii_clean or 'ARTSTICO' in ascii_clean:
            return 'Dibujo Art\u00edstico y Color'
        return 'Dibujo'
    if 'DISSENY' in ascii_clean or 'DISEO' in ascii_clean:
        if 'INTERIOR' in ascii_clean:
            return 'Dise\u00f1o de Interiores'
        if 'MODA' in ascii_clean:
            return 'Dise\u00f1o de Moda'
        if 'GRFIC' in ascii_clean or 'GRFICO' in ascii_clean:
            return 'Dise\u00f1o Gr\u00e1fico'
        return 'Dise\u00f1o'
    if 'ECONOM' in ascii_clean:
        return 'Econom\u00eda'
    if 'EQUIPS ELECTRNICS' in ascii_clean or 'EQUIPOS ELECTRNICOS' in ascii_clean:
        return 'Equipos Electr\u00f3nicos'
    if 'ESTRANGERS' in ascii_clean or 'EXTRANJEROS' in ascii_clean:
        return 'Espa\u00f1ol para Extranjeros'
    if 'ESTTICA' in ascii_clean:
        return 'Est\u00e9tica'
    if 'FILOSOF' in ascii_clean:
        return 'Filosof\u00eda'
    if 'FLAUTA' in ascii_clean:
        return 'Flauta Travesera'
    if 'COMPOSICI' in ascii_clean:
        return 'Fundamentos de Composici\u00f3n'
    if 'ORIENTACI LABORAL' in ascii_clean or 'ORIENTACIN LABORAL' in ascii_clean or 'FOL' in ascii_clean:
        return 'Formaci\u00f3n y Orientaci\u00f3n Laboral (FOL)'
    if 'FPA' in ascii_clean:
        if 'SOCIALS' in ascii_clean or 'SOCIALES' in ascii_clean:
            return 'FPA Ciencias Sociales'
        if 'VALENCI' in ascii_clean:
            return 'FPA Valenciano'
        return 'FPA Secundaria'
    if 'FRANCS' in ascii_clean:
        return 'Franc\u00e9s (Secundaria)'
    if 'FSICA I QUMICA' in ascii_clean or 'FSICA Y QUMICA' in ascii_clean or 'FISICA Y QUIMICA' in ascii_clean:
        return 'F\u00edsica y Qu\u00edmica'
    if 'FSICA' in ascii_clean or 'FISICA' in ascii_clean:
        return 'Educaci\u00f3n F\u00edsica (Secundaria)'
    if 'GEOGRAF' in ascii_clean:
        return 'Geograf\u00eda e Historia'
    if 'GREC' in ascii_clean or 'GRIEGO' in ascii_clean:
        return 'Griego'
    if 'GUITARRA' in ascii_clean:
        return 'Guitarra'
    if 'HISTRIA DE LA MSICA' in ascii_clean or 'HISTORIA DE LA MSICA' in ascii_clean:
        return 'Historia de la M\u00fasica'
    if 'HOSTALERIA' in ascii_clean or 'HOSTELERA' in ascii_clean:
        return 'Hosteler\u00eda y Turismo'
    if 'INFORMTICA' in ascii_clean or 'INFORMATICA' in ascii_clean:
        if 'APLICACIONS' in ascii_clean or 'APLICACIONES' in ascii_clean:
            return 'Sistemas y Aplicaciones Inform\u00e1ticas'
        if 'MITJANS' in ascii_clean or 'MEDIOS' in ascii_clean:
            return 'Medios Inform\u00e1ticos'
        return 'Inform\u00e1tica'
    if 'ELECTROTCNIQUES' in ascii_clean or 'ELECTROTCNICAS' in ascii_clean or 'ELECTROTECNICAS' in ascii_clean:
        return 'Instalaciones Electrot\u00e9cnicas'
    if 'TEATRE' in ascii_clean or 'TEATRO' in ascii_clean:
        return 'Interpretaci\u00f3n en el Teatro de Texto'
    if 'SOCIOCOMUNIT' in ascii_clean:
        return 'Intervenci\u00f3n Sociocomunitaria'
    if 'ITALI' in ascii_clean:
        return 'Italiano'
    if 'CASTELLANA' in ascii_clean:
        return 'Lengua Castellana y Literatura'
    if 'VALENCIANA' in ascii_clean or 'VALENCI' in ascii_clean:
        return 'Lengua y Literatura Valenciana'
    if 'MUSICAL' in ascii_clean:
        return 'Lenguaje Musical'
    if 'VEHICLES' in ascii_clean or 'VEHCULOS' in ascii_clean:
        if 'ORGANITZACI' in ascii_clean or 'ORGANIZACIN' in ascii_clean:
            return 'Organizaci\u00f3n y Procesos de Manto. Veh\u00edculos'
        return 'Mantenimiento de Veh\u00edculos'
    if 'MATEMT' in ascii_clean:
        return 'Matem\u00e1ticas'
    if 'MECANITZAT' in ascii_clean or 'MECANIZADO' in ascii_clean:
        return 'Mecanizado y Mantenimiento de M\u00e1quinas'
    if 'FABRICACI MECNICA' in ascii_clean or 'FABRICACIN MECNICA' in ascii_clean:
        return 'Organizaci\u00f3n y Proyectos de Fabricaci\u00f3n Mec\u00e1nica'
    if 'MSICA' in ascii_clean or 'MUSICA' in ascii_clean:
        return 'M\u00fasica (Secundaria)'
    if 'OBO' in ascii_clean:
        return 'Oboe'
    if 'ALIMENTARIS' in ascii_clean or 'ALIMENTARIOS' in ascii_clean or 'ALIMENTARIA' in ascii_clean:
        if 'ELABORACI' in ascii_clean:
            return 'Operaciones y Equipos de Elaboraci\u00f3n de Alimentos'
        return 'Procesos en la Industria Alimentaria'
    if 'AGRRIA' in ascii_clean or 'AGRARIA' in ascii_clean:
        return 'Operaciones y Equipos de Producci\u00f3n Agraria'
    if 'COMERCIAL' in ascii_clean:
        if 'ORGANITZACI' in ascii_clean or 'ORGANIZACIN' in ascii_clean:
            return 'Organizaci\u00f3n y Gesti\u00f3n Comercial'
        return 'Procesos Comerciales'
    if 'LEGISLACI' in ascii_clean or 'LEGISLACIN' in ascii_clean:
        return 'Organizaci\u00f3n Industrial y Legislaci\u00f3n'
    if 'ORIENTACI EDUCATIVA' in ascii_clean or 'ORIENTACIN EDUCATIVA' in ascii_clean:
        return 'Orientaci\u00f3n Educativa'
    if 'PEDAGOG' in ascii_clean:
        return 'Pedagog\u00eda Terap\u00e9utica (Secundaria)'
    if 'AUDICI' in ascii_clean:
        return 'Audici\u00f3n y Lenguaje (Secundaria)'
    if 'PERCUSI' in ascii_clean or 'PERCUSIN' in ascii_clean:
        return 'Percusi\u00f3n'
    if 'PERRUQUERIA' in ascii_clean or 'PELUQUERA' in ascii_clean:
        return 'Peluquer\u00eda'
    if 'PIANO' in ascii_clean:
        return 'Piano'
    if 'PORTUGUS' in ascii_clean:
        return 'Portugu\u00e9s'
    if 'SANITARIS' in ascii_clean or 'SANITARIOS' in ascii_clean:
        if 'PROCEDIMENTS' in ascii_clean or 'PROCEDIMIENTOS' in ascii_clean:
            return 'Procedimientos Sanitarios y Asistenciales'
        return 'Procesos Sanitarios'
    if 'ORTOPROT' in ascii_clean:
        if 'PROCED' in ascii_clean:
            return 'Procedimientos Diagn\u00f3stico Cl\u00ednico y Ortoprot\u00e9sico'
        return 'Procesos Diagn\u00f3stico Cl\u00ednico y Ortoprot\u00e9sicos'
    if 'MITJANS DE COMUNICACI' in ascii_clean or 'MEDIOS DE COMUNICACIN' in ascii_clean:
        return 'Procesos y Medios de Comunicaci\u00f3n'
    if 'VIDRE' in ascii_clean or 'VIDRIO' in ascii_clean or 'CERMICA' in ascii_clean:
        return 'Procesos y Productos de Vidrio y Cer\u00e1mica'
    if 'RUS' in ascii_clean:
        return 'Ruso'
    if 'SAX' in ascii_clean:
        return 'Saxof\u00f3n'
    if 'COMUNITAT' in ascii_clean or 'COMUNIDAD' in ascii_clean:
        return 'Servicios a la Comunidad'
    if 'RESTAURACI' in ascii_clean or 'RESTAURACIN' in ascii_clean:
        return 'Servicios de Restauraci\u00f3n'
    if 'ELECTROTCNICS I AUTOMTICS' in ascii_clean or 'ELECTROTCNICOS Y AUTOMTICOS' in ascii_clean:
        return 'Sistemas Electrot\u00e9cnicos y Autom\u00e1ticos'
    if 'ELECTRNICS' in ascii_clean or 'ELECTRNICOS' in ascii_clean:
        return 'Sistemas Electr\u00f3nicos'
    if 'TECNOLOG' in ascii_clean:
        return 'Tecnolog\u00eda'
    if 'TROMB' in ascii_clean:
        return 'Tromb\u00f3n'
    if 'TROMPA' in ascii_clean:
        return 'Trompa'
    if 'TUBA' in ascii_clean:
        return 'Tuba'
    if 'IMATGE I SO' in ascii_clean or 'IMAGEN Y SONIDO' in ascii_clean:
        return 'T\u00e9cnicas y Procedimientos de Imagen y Sonido'
    if 'RAB' in ascii_clean:
        return '\u00c1rabe'
        
    parts = raw.split('/')
    cand = parts[1].strip() if len(parts) > 1 else parts[0].strip()
    return cand.title()

def clean_text_utf8(t):
    return (t.replace('\ufffd', '')
             .replace('CASTELLN', 'Castell\u00f3n')
             .replace('VALNCIA', 'Valencia')
             .replace('ALACANT', 'Alicante')
             .replace('ELX', 'Elche')
             .replace('ALICANTE', 'Alicante')
             .replace('VALENCIA', 'Valencia')
             .replace('CASTELL\u00d3N', 'Castell\u00f3n')
             .replace('COLLEGI', 'Col\u00b7legi')
             .strip())

def parse_dest_line(line):
    c_name, m_name, prov = '', '', ''
    line = clean_text_utf8(line)
    if '/' in line:
        parts = line.split('/')
        c_name = parts[0].strip()
        loc_part = parts[1].strip()
        if ' - ' in loc_part:
            sub = [s.strip() for s in loc_part.split(' - ')]
            prov = sub[-1].title()
            m_name = ' - '.join(sub[:-1]).title()
        else:
            m_name = loc_part.title()
            prov = loc_part.title()
    else:
        c_name = line.strip()
    return c_name, m_name, prov

def parse_pdf(pdf_path, body_label):
    doc = pymupdf.open(pdf_path)
    records = []
    current_specialty = "General"
    
    for page_idx, page in enumerate(doc):
        text = page.get_text()
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        
        i = 0
        while i < len(lines):
            line = lines[i]
            
            # Detect header for body / specialty
            if i < 8:
                if 'MESTRES / MAESTROS' in line:
                    if i + 1 < len(lines) and not lines[i+1].startswith('***'):
                        current_specialty = lines[i+1]
                elif 'PROFESSORS' in line or 'CATEDR' in line or 'COSSOS' in line:
                    if i + 1 < len(lines) and not lines[i+1].startswith('***') and 'RESOLUCI' not in lines[i+1]:
                        current_specialty = lines[i+1]
            
            # Detect candidate start
            if re.match(r'^\*\*\*\d{4}\*\*$', line):
                dni = line
                name = lines[i+1] if i+1 < len(lines) else ''
                tipo = lines[i+2] if i+2 < len(lines) else ''
                
                dest_code = ''
                dest_text = ''
                orig_code = ''
                orig_text = ''
                total_pts = None
                
                for j in range(i+2, min(i+35, len(lines))):
                    l_sub = lines[j]
                    
                    if 'Origen / Origen:' in l_sub:
                        m = re.search(r'Origen:\s*(\d{8})', l_sub)
                        if m:
                            orig_code = m.group(1)
                        if j - 1 >= 0:
                            dest_text = lines[j-1]
                        if j - 2 >= 0 and not orig_text:
                            orig_text = lines[j-2]
                            
                    if 'Destí / Destino:' in l_sub or 'Desti / Destino:' in l_sub:
                        m = re.search(r'Destino:\s*(\d{8})', l_sub)
                        if m:
                            dest_code = m.group(1)
                            
                    if l_sub == 'Total' and j > i+3:
                        pts_str = lines[j-1].replace(',', '.')
                        try:
                            total_pts = round(float(pts_str), 4)
                        except:
                            pass
                        break
                
                if dest_code and total_pts is not None:
                    records.append({
                        'cuerpo': body_label,
                        'raw_spec': current_specialty,
                        'dni': dni,
                        'nombre': clean_text_utf8(name),
                        'tipo': tipo,
                        'dest_code': dest_code,
                        'dest_text': dest_text,
                        'orig_code': orig_code,
                        'orig_text': orig_text,
                        'puntos': total_pts
                    })
                i += 6
            else:
                i += 1
                
    return records

def build_database():
    catalog = load_centros_catalog()
    print("Catalog loaded with", len(catalog), "centers.")
    
    maestros_records = parse_pdf('cgt_25-26_maestros.pdf', 'Maestros')
    print("Maestros parsed:", len(maestros_records))
    
    secundaria_records = parse_pdf('cgt_25-26_secundaria.pdf', 'Secundaria y FP')
    print("Secundaria parsed:", len(secundaria_records))
    
    all_records = maestros_records + secundaria_records
    
    # Group by (dest_code, especialidad_limpia)
    grouped = {}
    specialties_set = set()
    municipios_set = set()
    provincias_set = set()
    
    for r in all_records:
        spec_clean = clean_spec_name(r['raw_spec'], r['cuerpo'])
        specialties_set.add(spec_clean)
        
        c_info = catalog.get(r['dest_code'])
        if c_info:
            c_name = c_info['nombre']
            m_name = c_info['municipio'].title()
            prov = c_info['provincia'].title()
            comarca = c_info['comarca']
        else:
            raw_c, raw_m, raw_p = parse_dest_line(r['dest_text'])
            c_name = raw_c or f"Centro {r['dest_code']}"
            m_name = raw_m or "Comunitat Valenciana"
            prov = raw_p or ("Castell\u00f3n" if r['dest_code'].startswith('12') else ("Alicante" if r['dest_code'].startswith('03') else "Valencia"))
            comarca = ""
            
        municipios_set.add(m_name)
        if prov:
            provincias_set.add(prov)
            
        key = (r['dest_code'], spec_clean)
        if key not in grouped:
            grouped[key] = {
                'cod': r['dest_code'],
                'centro': c_name,
                'mun': m_name,
                'prov': prov,
                'com': comarca,
                'cuerpo': r['cuerpo'],
                'esp': spec_clean,
                'puntos_list': [],
                'adjudicaciones': []
            }
            
        # Clean tipo
        tipo_clean = "Voluntaria"
        if "preferent" in r['tipo'].lower() or "preferente" in r['tipo'].lower():
            if "centre" in r['tipo'].lower() or "centro" in r['tipo'].lower():
                tipo_clean = "Derecho pref. centro"
            elif "localit" in r['tipo'].lower() or "localidad" in r['tipo'].lower():
                tipo_clean = "Derecho pref. localidad"
            else:
                tipo_clean = "Derecho preferente"
        elif "for\u00e7" in r['tipo'].lower() or "forz" in r['tipo'].lower():
            tipo_clean = "Forzosa"
        elif "petic" in r['tipo'].lower():
            m_pet = re.search(r'(\d+)', r['tipo'])
            if m_pet:
                tipo_clean = f"Pet. #{m_pet.group(1)}"
            else:
                tipo_clean = "Voluntaria"
                
        grouped[key]['puntos_list'].append(r['puntos'])
        grouped[key]['adjudicaciones'].append({
            'dni': r['dni'],
            'nom': r['nombre'],
            'pts': r['puntos'],
            'tipo': tipo_clean,
            'orig': r['orig_text'] if r['orig_text'] and 'RESOLUCI' not in r['orig_text'] else ''
        })
        
    # Process into final list
    cortes_list = []
    for (cod, esp), g in grouped.items():
        pts = g['puntos_list']
        pts.sort() # ascending
        corte = pts[0] # lowest point obtained is the cutoff!
        max_pts = pts[-1]
        avg_pts = round(sum(pts) / len(pts), 4)
        
        # Sort adjudications descending by points
        g['adjudicaciones'].sort(key=lambda x: x['pts'], reverse=True)
        
        cortes_list.append({
            'cod': g['cod'],
            'cen': g['centro'],
            'mun': g['mun'],
            'prv': g['prov'],
            'com': g['com'],
            'crp': g['cuerpo'],
            'esp': g['esp'],
            'plz': len(pts),
            'min': corte,
            'max': max_pts,
            'avg': avg_pts,
            'adj': g['adjudicaciones']
        })
        
    # Sort cortes by default: Cuerpo, Especialidad, Min points desc
    cortes_list.sort(key=lambda x: (x['crp'], x['esp'], -x['min']))
    
    # Build metadata & summary
    summary = {
        'total_adjudicaciones': len(all_records),
        'total_plazas_maestros': len(maestros_records),
        'total_plazas_secundaria': len(secundaria_records),
        'total_centros': len(set(c['cod'] for c in cortes_list)),
        'total_especialidades': len(specialties_set),
        'convocatoria': '2025/2026 (Resoluci\u00f3n 25/03/2026, DOGV 10331 y 10332)',
        'especialidades': sorted(list(specialties_set)),
        'municipios': sorted([m for m in municipios_set if len(m) > 1]),
        'provincias': ['Alicante', 'Castell\u00f3n', 'Valencia']
    }
    
    final_output = {
        'summary': summary,
        'cortes': cortes_list
    }
    
    js_content = f"// Datos oficiales del Concurso de Traslados de la Comunitat Valenciana 2025/2026\n// Extra\u00eddos del DOGV 10331 y 10332 (Resoluciones de 25 de marzo de 2026)\nconst HISTORICO_CONCURSO_DATA = {json.dumps(final_output, ensure_ascii=False)};\n"
    
    out_path = 'historico_data.js'
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print(f"Successfully generated {out_path} with {len(cortes_list)} center-specialty cutoffs.")
    print(f"Total adjudications processed: {len(all_records)}")

if __name__ == '__main__':
    build_database()
