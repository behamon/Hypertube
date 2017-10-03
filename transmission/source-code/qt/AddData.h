/*
 * This file Copyright (C) 2012-2016 Mnemosyne LLC
 *
 * It may be used under the GNU GPL versions 2 or 3
 * or any future license endorsed by Mnemosyne LLC.
 *
 * $Id: AddData.h 14732 2016-04-19 20:41:59Z mikedld $
 */

#pragma once

#include <QByteArray>
#include <QString>
#include <QUrl>

class AddData
{
  public:
    enum
    {
      NONE,
      MAGNET,
      URL,
      FILENAME,
      METAINFO
    };

  public:
    AddData (): type (NONE) {}
    AddData (const QString& str) { set (str); }

    int set (const QString&);

    QByteArray toBase64 () const;
    QString readableName () const;
    QString readableShortName () const;

    static bool isSupported (const QString& str) { return AddData (str).type != NONE; }

  public:
    int type;
    QByteArray metainfo;
    QString filename;
    QString magnet;
    QUrl url;
};

