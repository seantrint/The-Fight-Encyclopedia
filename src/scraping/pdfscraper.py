import PyPDF2
import tabula
import pandas
import pickle
import re
import string
import os
import fileinput
import fitz
import subprocess
import pyodbc 
#boxer names were saved from index sections of book
#we want to use these names as keys to pick up on patters in certain pages of the book to save data we need
#e.g. Mike Tyson with a certain font-size -> save image on this page
nameslist = []
conn = pyodbc.connect('Driver={SQL Server};'
                      'Server=WINDOWS-25B0042\SQLEXPRESS,1433;'
                      'Database=testdata;'
                      'Trusted_Connection=yes;')

cursor = conn.cursor()
#select every name from db
cursor.execute('SELECT BoxerName from Boxer')

for row in cursor:
    nameslist.append('Barney Aaron')
#search the pdf for every name from the db    
pathAndFileName = 'C:/Users/Sean/Desktop/projects/textfiles_uncleaned/entirepdf.txt'    
file = open(pathAndFileName,'w', encoding = "utf-8")
pdfFileObj = open('C:/Users/Sean/Desktop/projects/Pdfs_from_scan/The boxing register  International Boxing Hall of Fame official record book by Roberts, James B. Skutt, Alexander G (z-lib.org).pdf', 'rb')
doc = fitz.open('C:/Users/Sean/Desktop/projects/Pdfs_from_scan/The boxing register  International Boxing Hall of Fame official record book by Roberts, James B. Skutt, Alexander G (z-lib.org).pdf')    
pdfReader = PyPDF2.PdfFileReader(pdfFileObj)
print(pdfReader.numPages)
pageObj = pdfReader.getPage(0)
for name in nameslist:

    imageName = name #get this from db
    print(imageName)
    i = 0
    picFound = 0
    #for every page in book
    while i<pdfReader.getNumPages():
        pageinfo = pdfReader.getPage(i)
        textForFile = pageinfo.extractText()
        #search current name against the current page of the pdf
        ResSearch = str(re.search(imageName, textForFile))
        #'match=' is contained in the string when a search result is found, otherwise it says None
        if 'match=' in ResSearch:
            rangeStart = 0
            rangeEnd = 101
            #print(ResSearch)
            spanList = str(re.findall('\d+', ResSearch))
            spanList = re.sub(r"'", '', spanList)     
            spanList = spanList.replace('[','(').replace(']',')')
            # while rangeStart < 100:
            #     rangeStart +=1
            #     if str(0<= rangeStart >=100) in spanList:
            #         print('yes')
            #for every line on this page, check if the current name is on a line on its own
            for line in doc[i].getText().splitlines():
                if(imageName == line):
                    print(line) 
                    print(ResSearch)
                    print(spanList)
                    if spanList in range(0, 100):
                        print(spanList)
            #if 'span='+spanList in ResSearch:
            #     for img in doc.getPageImageList(i): 
            #         xref = img[0]
            #         pix = fitz.Pixmap(doc, xref)
            #         if picFound <1: 
            #             if pix.n - pix.alpha < 4:     
            #                 pix.writePNG("C:/Users/Sean/Desktop/projects/textfiles_uncleaned/testimagesfolder/{0}.png".format(imageName))
            #                 picFound = 1
            #             else:
            #                 pix1 = fitz.Pixmap(fitz.csRGB, pix)
            #                 pix1.writePNG("C:/Users/Sean/Desktop/projects/textfiles_uncleaned/testimagesfolder/{0}.png".format(imageName))
            #                 pix1 = None
            #                 picFound = 1
            #             pix = None
            #        #search for text patterns
                        
            #textForFile = doc[i].getText()
            #file.write(textForFile)
            #for every line on this page, check if the current name is on a line on its own
            # for line in doc[i].getText().splitlines():
            #     print(ResSearch)
            #     if(imageName == line):
            #         print(line)
            #         #save image on this page
            #         for img in doc.getPageImageList(i): 
            #             xref = img[0]
            #             pix = fitz.Pixmap(doc, xref)
            #             if picFound <1: 
            #                 if pix.n - pix.alpha < 4:     
            #                     pix.writePNG("C:/Users/Sean/Desktop/projects/textfiles_uncleaned/testimagesfolder/{0}.png".format(imageName))
            #                     picFound = 1
            #                 else:
            #                     pix1 = fitz.Pixmap(fitz.csRGB, pix)
            #                     pix1.writePNG("C:/Users/Sean/Desktop/projects/textfiles_uncleaned/testimagesfolder/{0}.png".format(imageName))
            #                     pix1 = None
            #                     picFound = 1
            #                 pix = None
        i=i+1
file.close()        