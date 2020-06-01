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
#CHANGE THIS TO WRITE DIRECTLY TO DB
#USE MAX ID AND INCREMENT BY 1
def swapPositions(list, pos1, pos2): 
      
    # popping both the elements from list 
    first_ele = list.pop(pos1)    
    second_ele = list.pop(pos2-1) 
     
    # inserting in each others positions 
    list.insert(pos1, second_ele)   
    list.insert(pos2, first_ele)   
      
    return list
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
    if line:
        if len(line.split()) == 3:
            shuffleWords = line.split()
            newlist = []
            for val in shuffleWords:
                newlist.append(val)
            if newlist[0] == 'Jr':
                newlist[0] ='Jr.'
                newlist.sort(key = newlist[0].__eq__)
            else:    
                pos1 = 2
                pos2 = 1
                swapPositions(newlist, pos1-1, pos2-1)
            print(newlist) 
            line = str(newlist)
            line = line.replace("'",'').replace(',','').replace('[','').replace(']','')
        reversedOutput.write(line+'\n')
newfile.close()
reversedOutput.close()    

  
 