# -*- coding: utf-8 -*-
"""Builds the DD-254 Interactive user manual PDF from content.py.
   Kept alongside the PDF so a refresh is an edit, not a rebuild."""
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph,
                                Spacer, Table, TableStyle, PageBreak, NextPageTemplate)
from reportlab.platypus.flowables import HRFlowable
from content import DOC, TITLE, SUB, VER

NAVY=colors.HexColor('#2b3440'); STEEL=colors.HexColor('#4a5866')
LINE=colors.HexColor('#b0bac6'); MUT=colors.HexColor('#6a7888')
RED=colors.HexColor('#8b1a0a'); REDBG=colors.HexColor('#fdf0ef')
AMB=colors.HexColor('#7a4800'); AMBBG=colors.HexColor('#fef3e0')
LIGHT=colors.HexColor('#f1f3f5'); HDRBG=colors.HexColor('#e8ecef')

S=lambda **k: ParagraphStyle(**k)
st_h1=S(name='h1',fontName='Helvetica-Bold',fontSize=14,leading=17,textColor=NAVY,spaceBefore=4,spaceAfter=5,keepWithNext=1)
st_h2=S(name='h2',fontName='Helvetica-Bold',fontSize=11,leading=14,textColor=STEEL,spaceBefore=9,spaceAfter=3,keepWithNext=1)
st_h3=S(name='h3',fontName='Helvetica-Bold',fontSize=9.8,leading=12,textColor=colors.HexColor('#1a3a5a'),spaceBefore=6,spaceAfter=2,keepWithNext=1)
st_p =S(name='p',fontName='Helvetica',fontSize=9.6,leading=14.2,textColor=colors.HexColor('#1a1e26'),spaceAfter=5,alignment=TA_LEFT)
st_n =S(name='n',parent=st_p,leftIndent=16,bulletIndent=4,spaceAfter=3)
st_box=S(name='box',fontName='Helvetica',fontSize=9.3,leading=13.4,textColor=colors.HexColor('#1a1e26'))
st_tc=S(name='tc',fontName='Helvetica',fontSize=8.9,leading=12.4,textColor=colors.HexColor('#1a1e26'))
st_th=S(name='th',fontName='Helvetica-Bold',fontSize=8.9,leading=12.4,textColor=NAVY)

def deco(c,d):
    c.saveState()
    c.setStrokeColor(LINE); c.setLineWidth(.5)
    c.line(0.75*inch, 0.72*inch, d.pagesize[0]-0.75*inch, 0.72*inch)
    c.setFont('Helvetica',7.6); c.setFillColor(MUT)
    c.drawString(0.75*inch, 0.56*inch, 'DD-254 Interactive — User Manual')
    c.drawRightString(d.pagesize[0]-0.75*inch, 0.56*inch, 'Page %d' % c.getPageNumber())
    c.restoreState()

def cover(c,d):
    c.saveState()
    c.setFillColor(NAVY); c.rect(0, d.pagesize[1]-3.5*inch, d.pagesize[0], 1.85*inch, fill=1, stroke=0)
    c.setFillColor(colors.white); c.setFont('Helvetica-Bold',25)
    c.drawString(0.75*inch, d.pagesize[1]-2.45*inch, 'DD-254 Interactive')
    c.setFont('Helvetica',13.5); c.setFillColor(colors.HexColor('#b8c6d4'))
    c.drawString(0.75*inch, d.pagesize[1]-2.85*inch, 'User Manual')
    c.setFillColor(STEEL); c.setFont('Helvetica',11)
    c.drawString(0.75*inch, d.pagesize[1]-4.05*inch, SUB)
    c.setFillColor(MUT); c.setFont('Helvetica',9)
    c.drawString(0.75*inch, d.pagesize[1]-4.35*inch, VER)
    c.setStrokeColor(LINE); c.setLineWidth(.5)
    c.line(0.75*inch, 1.5*inch, d.pagesize[0]-0.75*inch, 1.5*inch)
    c.setFont('Helvetica',8.4); c.setFillColor(MUT)
    c.drawString(0.75*inch, 1.28*inch, 'Runs entirely in your browser. No server, no network, no login.')
    c.drawString(0.75*inch, 1.10*inch, 'All data is local to this machine and this browser profile.')
    c.restoreState()

def shaded(txt,bg,bar):
    t=Table([[Paragraph(txt,st_box)]], colWidths=[7.0*inch])
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),bg),('LINEBEFORE',(0,0),(0,-1),3,bar),
        ('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),
        ('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]))
    return t

def table(rows):
    n=len(rows[0])
    w={2:[2.1*inch,4.9*inch],3:[1.8*inch,2.7*inch,2.5*inch]}.get(n,[7.0/n*inch]*n)
    data=[[Paragraph(x,st_th) for x in rows[0]]]+[[Paragraph(x,st_tc) for x in r] for r in rows[1:]]
    t=Table(data,colWidths=w,repeatRows=1)
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),HDRBG),('LINEBELOW',(0,0),(-1,0),.8,STEEL),
        ('LINEBELOW',(0,1),(-1,-2),.3,LINE),('VALIGN',(0,0),(-1,-1),'TOP'),
        ('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),
        ('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4),
        ('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,LIGHT])]))
    return t

story=[]; num=0
for kind,val in DOC:
    if kind=='h1':
        if len(story)>2:
            story.append(Spacer(1,11)); story.append(HRFlowable(width='100%',thickness=.7,color=LINE,spaceAfter=7))
        story.append(Paragraph(val,st_h1)); num=0
    elif kind=='h2': story.append(Paragraph(val,st_h2))
    elif kind=='h3': story.append(Paragraph(val,st_h3))
    elif kind=='p':  story.append(Paragraph(val,st_p))
    elif kind=='n':  num+=1; story.append(Paragraph(val,st_n,bulletText=u'%d.'%num))
    elif kind=='b':  story.append(Paragraph(val,st_n,bulletText=u'•'))
    elif kind=='warn': story.append(Spacer(1,2)); story.append(shaded(val,REDBG,RED)); story.append(Spacer(1,5))
    elif kind=='note': story.append(Spacer(1,2)); story.append(shaded(val,AMBBG,AMB)); story.append(Spacer(1,5))
    elif kind=='tbl':  story.append(Spacer(1,2)); story.append(table(val)); story.append(Spacer(1,6))

doc=BaseDocTemplate('DD254_User_Manual.pdf',pagesize=letter,
    leftMargin=0.75*inch,rightMargin=0.75*inch,topMargin=0.7*inch,bottomMargin=0.85*inch,
    title='DD-254 Interactive — User Manual',author='DD-254 Interactive')
fr=Frame(doc.leftMargin,doc.bottomMargin,doc.width,doc.height,id='n')
doc.addPageTemplates([PageTemplate(id='cover',frames=[fr],onPage=cover),
                      PageTemplate(id='body',frames=[fr],onPage=deco)])
story.insert(0,PageBreak()); story.insert(0,NextPageTemplate('body'))
doc.build(story)
print("built")
