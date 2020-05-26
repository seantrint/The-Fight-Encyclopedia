# -*- coding: utf-8 -*-
"""
Created on Wed May 20 19:26:36 2020

@author: Sean
"""
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

#search the pdf for every name from the db    
pathAndFileName = 'C:/Users/Sean/Desktop/projects/textfiles_uncleaned/entirepdf.txt'    
file = open(pathAndFileName,'w+', encoding = "utf-8")
pdfFileObj = open('C:/Users/Sean/Desktop/projects/Pdfs_from_scan/The boxing register  International Boxing Hall of Fame official record book by Roberts, James B. Skutt, Alexander G (z-lib.org).pdf', 'rb')
pdfReader = PyPDF2.PdfFileReader(pdfFileObj)
i = 0
indexFound = 0
#for every page in book
while i<pdfReader.getNumPages():
    pageinfo = pdfReader.getPage(i)
    textForFile = pageinfo.extractText()
    if 'I N D E X' in textForFile:
        textForFile = re.sub('[%s]' % re.escape(string.punctuation), '', textForFile)
        textForFile = re.sub(r'\d+', '', textForFile)
        textForFile = re.sub('Index','',textForFile)
        textForFile = re.sub('–','',textForFile)
        textForFile = re.sub('I N D E X','',textForFile)
        textForFile = re.sub(r'\n\s*\n','\n',textForFile,re.MULTILINE)    
        
        file.write(textForFile)
        indexFound = 1
    if indexFound == 1:
        textForFile = re.sub('[%s]' % re.escape(string.punctuation), '', textForFile)
        textForFile = re.sub(r'\d+', '', textForFile)
        textForFile = re.sub('Index','',textForFile)
        textForFile = re.sub('–','',textForFile)
        textForFile = re.sub('I N D E X','',textForFile)
        textForFile = re.sub(r'\n\s*\n','\n',textForFile,re.MULTILINE)        
        
        file.write(textForFile)
    i=i+1
file.close() 
newfile = open(pathAndFileName, 'r+', encoding = "utf-8")
reversedOutput = open('C:/Users/Sean/Desktop/projects/textfiles_uncleaned/reversedOutput.txt','w+', encoding = "utf-8")
for line in newfile:
    line = line.replace(line," ".join(reversed(line.split())))
    reversedOutput.write(line+'\n')
newfile.close()
reversedOutput.close()    
# for line in data:
#     line = line.split()
#     data_2.append(" ".join(reversed(line)))   
#     data_2.append('\n')

#f2.writelines(data_2) 
  
 